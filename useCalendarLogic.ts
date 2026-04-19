import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    gregorianToJdn, jdnToGregorian,
    solarHijriToJdn, jdnToSolarHijri,
    lunarHijriToJdn, jdnToLunarHijri,
    formatNumber
} from './calendarEngine';

export type SupportedLanguage = 'en' | 'fa' | 'ps';

export function useCalendarLogic() {
    // 1. Manage a single currentJdn state. Default to today's Miladi date.
    const [currentJdn, setCurrentJdn] = useState<number>(() => {
        const today = new Date();
        return gregorianToJdn(today.getFullYear(), today.getMonth() + 1, today.getDate());
    });

    // 2. Localization State
    const [language, setLanguage] = useState<SupportedLanguage>('en');

    // 3. New Hook States: Lunar offset (+/- 1 day) and Toast feedback
    const [qamariOffset, setQamariOffset] = useState<number>(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Effect: Update document.dir and document's font-family when language changes
    useEffect(() => {
        const isRtl = language === 'fa' || language === 'ps';
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        
        // Switch the app's font seamlessly based on the language
        if (language === 'ps') {
            document.documentElement.style.fontFamily = "'Bahij', 'Pashto', system-ui, sans-serif";
        } else if (language === 'fa') {
            document.documentElement.style.fontFamily = "'Vazirmatn', 'Persian', system-ui, sans-serif";
        } else {
            document.documentElement.style.fontFamily = "'Inter', 'Roboto', system-ui, sans-serif";
        }
    }, [language]);

    // 3. Sync: Derived calendar dates map from the single source of truth (currentJdn)
    // When currentJdn updates, these memorize dynamically instantly
    const gregorian = useMemo(() => jdnToGregorian(currentJdn), [currentJdn]);
    const shamsi = useMemo(() => jdnToSolarHijri(currentJdn), [currentJdn]);
    // Apply user-defined visual offset (+/- 1 Day) for Qamari moon sightings
    const qamari = useMemo(() => jdnToLunarHijri(currentJdn + qamariOffset), [currentJdn, qamariOffset]);

    // Handlers: Drive currentJdn state backwards based on the calender inputted
    const handleMiladiChange = useCallback((year: number, month: number, day: number) => {
        setCurrentJdn(gregorianToJdn(year, month, day));
    }, []);

    const handleShamsiChange = useCallback((year: number, month: number, day: number) => {
        setCurrentJdn(solarHijriToJdn(year, month, day));
    }, []);

    const handleQamariChange = useCallback((year: number, month: number, day: number) => {
        // Deduct the offset to ensure the source JDN underlying the app remains strictly accurate mathematically
        setCurrentJdn(lunarHijriToJdn(year, month, day) - qamariOffset);
    }, [qamariOffset]);

    // Utility: Format numbers easily throughout the connected UI Component
    const format = useCallback((num: number | string) => {
        return formatNumber(num, language);
    }, [language]);

    // Feature: Copy formatted date securely to clipboard, firing a toast msg correctly localized
    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            const msg = language === 'en' ? 'Copied to clipboard!' : (language === 'fa' ? 'در کلیپ‌بورد کپی شد!' : 'کاپي شو!');
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3000);
            return true;
        } catch (err) {
            console.error('Failed to copy', err);
            return false;
        }
    }, [language]);

    // Feature: Returns localized, formatted string for difference between two discrete dates in Days, Weeks, Months.
    const getFormattedDifference = useCallback((jdnA: number, jdnB: number) => {
        const diffDays = Math.abs(jdnA - jdnB);
        const months = Math.floor(diffDays / 30);
        const weeks = Math.floor((diffDays % 30) / 7);
        const days = diffDays - (months * 30) - (weeks * 7);

        let parts = [];
        if (months > 0) {
            const mLabel = language === 'en' ? (months === 1 ? 'Month' : 'Months') : (language === 'fa' ? 'ماه' : 'میاشتې');
            parts.push(`${formatNumber(months, language)} ${mLabel}`);
        }
        if (weeks > 0) {
            const wLabel = language === 'en' ? (weeks === 1 ? 'Week' : 'Weeks') : (language === 'fa' ? 'هفته' : 'اونۍ');
            parts.push(`${formatNumber(weeks, language)} ${wLabel}`);
        }
        if (days > 0 || parts.length === 0) {
            const dLabel = language === 'en' ? (days === 1 ? 'Day' : 'Days') : (language === 'fa' ? 'روز' : 'ورځې');
            parts.push(`${formatNumber(days, language)} ${dLabel}`);
        }

        const delimiter = language === 'en' ? ', ' : ' و ';
        return parts.join(delimiter);
    }, [language]);

    return {
        currentJdn,
        language,
        setLanguage,
        gregorian,
        shamsi,
        qamari,
        handlers: {
            onMiladiChange: handleMiladiChange,
            onShamsiChange: handleShamsiChange,
            onQamariChange: handleQamariChange
        },
        qamariOffset,
        setQamariOffset,
        copyToClipboard,
        toastMessage,
        getFormattedDifference,
        format
    };
}
