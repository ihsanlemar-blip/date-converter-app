import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    gregorianToJdn, jdnToGregorian,
    solarHijriToJdn, jdnToSolarHijri,
    lunarHijriToJdn, jdnToLunarHijri,
    getGregorianDaysInMonth, getSolarHijriDaysInMonth, getLunarHijriDaysInMonth,
    formatNumber
} from './calendarEngine';

export type SupportedLanguage = 'en' | 'fa' | 'ps';
export type CalendarLayout = 'grid' | 'stack' | 'bento' | 'compact' | 'modern' | 'linear' | 'carousel';
export type MonthStyle = 'afghani' | 'iranian';
export type NumberSystem = 'latin' | 'persian';

export function useCalendarLogic() {
    // 1. Manage a single currentJdn state. Default to today's Miladi date.
    const [currentJdn, setCurrentJdn] = useState<number>(() => {
        const today = new Date();
        return gregorianToJdn(today.getFullYear(), today.getMonth() + 1, today.getDate());
    });

    // 2. Localization State
    const [language, setLanguage] = useState<SupportedLanguage>(() => {
        const stored = localStorage.getItem('calendar-lang');
        // migrate 'dr' to 'fa'
        return (stored === 'dr' ? 'fa' : (stored as SupportedLanguage)) || 'fa';
    });

    useEffect(() => {
        localStorage.setItem('calendar-lang', language);
    }, [language]);

    // 3. New Hook States: Settings Configuration
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [qamariOffset, setQamariOffset] = useState<number>(() => {
        return parseInt(localStorage.getItem('calendar-qamari-offset') || '0');
    });

    useEffect(() => {
        localStorage.setItem('calendar-qamari-offset', qamariOffset.toString());
    }, [qamariOffset]);

    const [theme, setTheme] = useState<string>(() => {
        const saved = localStorage.getItem('calendar-theme');
        if (saved) return saved;
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark';
    });

    useEffect(() => {
        localStorage.setItem('calendar-theme', theme);
    }, [theme]);

    // 4. Carousel State (Only for carousel layout)
    const [carouselActive, setCarouselActive] = useState<number>(0);

    // Effect: Dynamically update html data-theme attribute
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // 4. Layout Management
    const [layout, setLayout] = useState<CalendarLayout>(() => {
        return (localStorage.getItem('calendar-layout') as CalendarLayout) || 'grid';
    });

    useEffect(() => {
        localStorage.setItem('calendar-layout', layout);
    }, [layout]);

    // Month Name Style
    const [monthStyle, setMonthStyle] = useState<MonthStyle>(() => {
        return (localStorage.getItem('calendar-month-style') as MonthStyle) || 'afghani';
    });
    useEffect(() => {
        localStorage.setItem('calendar-month-style', monthStyle);
    }, [monthStyle]);

    // Number System (digit style): defaults to 'persian' for fa/ps, 'latin' for en
    const [numberSystem, setNumberSystem] = useState<NumberSystem>(() => {
        const stored = localStorage.getItem('calendar-number-system') as NumberSystem;
        if (stored === 'latin' || stored === 'persian') return stored;
        // Default: Eastern Arabic for RTL languages
        const lang = (localStorage.getItem('calendar-lang') as SupportedLanguage) || 'fa';
        return (lang === 'en') ? 'latin' : 'persian';
    });
    useEffect(() => {
        localStorage.setItem('calendar-number-system', numberSystem);
    }, [numberSystem]);

    // Effect: Update document.dir and document's font-family when language changes
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
    // Apply user-defined visual offset (+/- offset Day) for Qamari moon sightings
    const qamari = useMemo(() => jdnToLunarHijri(currentJdn + qamariOffset), [currentJdn, qamariOffset]);

    const playWarningSound = useCallback(() => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(330, audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.error("Audio error", e);
        }
    }, []);

    const triggerToast = useCallback((msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    }, []);

    // Handlers: Drive currentJdn state backwards based on the calender inputted
    const handleMiladiChange = useCallback((year: number, month: number, day: number) => {
        if (year > 9999 || year < -2000) {
            playWarningSound();
            triggerToast(language === 'en' ? 'Year out of range (-2000 to 9999)' : 'سال خارج از محدوده است');
            return;
        }
        const maxDays = getGregorianDaysInMonth(year, month);
        const clampedDay = Math.max(1, Math.min(day, maxDays));
        setCurrentJdn(gregorianToJdn(year, month, clampedDay));
    }, [language, playWarningSound]);

    const handleShamsiChange = useCallback((year: number, month: number, day: number) => {
        if (year > 9999 || year < -2000) {
            playWarningSound();
            triggerToast(language === 'en' ? 'Year out of range (-2000 to 9999)' : 'سال خارج از محدوده است');
            return;
        }
        const maxDays = getSolarHijriDaysInMonth(year, month);
        const clampedDay = Math.max(1, Math.min(day, maxDays));
        setCurrentJdn(solarHijriToJdn(year, month, clampedDay));
    }, [language, playWarningSound]);

    const handleQamariChange = useCallback((year: number, month: number, day: number) => {
        if (year > 9999 || year < -2000) {
            playWarningSound();
            triggerToast(language === 'en' ? 'Year out of range (-2000 to 9999)' : 'سال خارج از محدوده است');
            return;
        }
        const maxDays = getLunarHijriDaysInMonth(year, month);
        const clampedDay = Math.max(1, Math.min(day, maxDays));
        // Deduct the offset to ensure the source JDN underlying the app remains strictly accurate mathematically
        setCurrentJdn(lunarHijriToJdn(year, month, clampedDay) - qamariOffset);
    }, [qamariOffset, language, playWarningSound]);

    // Utility: Format numbers easily throughout the connected UI Component
    // English is always latin; for other languages use the user's numberSystem preference.
    const format = useCallback((num: number | string) => {
        const system = language === 'en' ? 'latin' : numberSystem;
        return formatNumber(num, language, system);
    }, [language, numberSystem]);

    // Feature: Copy formatted date securely to clipboard, firing a toast msg correctly localized
    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            const msg = language === 'en' ? 'Copied to clipboard!' : (language === 'fa' ? 'در کلیپ‌بورد کپی شد!' : 'کاپي شو!');
            triggerToast(msg);
            return true;
        } catch (err) {
            console.error('Failed to copy', err);
            return false;
        }
    }, [language, triggerToast]);

    // Feature: Returns localized, formatted string for difference between two discrete dates.
    // Format: "1 year, 2 months and 12 days (50 weeks)"
    // Weeks are calculated from total diffDays independently and appended in parentheses.
    const getFormattedDifference = useCallback((jdnA: number, jdnB: number) => {
        const diffDays = Math.abs(jdnA - jdnB);
        const sys = language === 'en' ? 'latin' : numberSystem;
        const fmt = (n: number) => formatNumber(n, language, sys);

        // Main breakdown: years → months → remaining days
        const years = Math.floor(diffDays / 365.25);
        const remAfterYears = diffDays - years * 365.25;
        const months = Math.floor(remAfterYears / 30.44);
        const remAfterMonths = remAfterYears - months * 30.44;
        const days = Math.floor(remAfterMonths);

        // Total weeks from the full diff (independent)
        const totalWeeks = Math.floor(diffDays / 7);

        let parts: string[] = [];
        if (years > 0) {
            const yLabel = language === 'en' ? (years === 1 ? 'year' : 'years') : (language === 'fa' ? 'سال' : 'کاله');
            parts.push(`${fmt(years)} ${yLabel}`);
        }
        if (months > 0) {
            const mLabel = language === 'en' ? (months === 1 ? 'month' : 'months') : (language === 'fa' ? 'ماه' : 'میاشتې');
            parts.push(`${fmt(months)} ${mLabel}`);
        }
        if (days > 0 || parts.length === 0) {
            const dLabel = language === 'en' ? (days === 1 ? 'day' : 'days') : (language === 'fa' ? 'روز' : 'ورځې');
            parts.push(`${fmt(days)} ${dLabel}`);
        }

        const mainSep = language === 'en' ? ', ' : '، ';
        const andSep = language === 'en' ? ' and ' : ' و ';

        let res = '';
        if (parts.length <= 1) {
            res = parts[0] || '';
        } else {
            const last = parts.pop()!;
            res = parts.join(mainSep) + andSep + last;
        }

        // Append total weeks in parentheses
        if (totalWeeks > 0) {
            const wLabel = language === 'en' ? (totalWeeks === 1 ? 'week' : 'weeks') : (language === 'fa' ? 'هفته' : 'اونۍ');
            const openParen  = language === 'en' ? '(' : '(';
            const closeParen = language === 'en' ? ')' : ')';
            res += ` ${openParen}${fmt(totalWeeks)} ${wLabel}${closeParen}`;
        }

        if (jdnA > jdnB) return '+ ' + res;
        if (jdnA < jdnB) return '- ' + res;
        return res;
    }, [language, numberSystem]);

    const todayJdn = useMemo(() => {
        const today = new Date();
        return gregorianToJdn(today.getFullYear(), today.getMonth() + 1, today.getDate());
    }, []);

    return {
        currentJdn,
        todayJdn,
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
        theme,
        setTheme,
        layout,
        setLayout,
        monthStyle,
        setMonthStyle,
        numberSystem,
        setNumberSystem,
        qamariOffset,
        setQamariOffset,
        copyToClipboard,
        toastMessage,
        getFormattedDifference,
        format,
        carouselActive,
        setCarouselActive
    };
}
