/**
 * calendarEngine.ts
 * A robust utility to convert between Gregorian, Solar Hijri (with 33-year leap cycle),
 * and Tabular Lunar Hijri using Julian Day Number (JDN) as the bridge.
 */

// Epoch constants
export const SOLAR_EPOCH_JDN = 1948321; // Friday, 1 Farvardin 1 AP (March 22, 622 Gregorian)
export const LUNAR_EPOCH_JDN = 1948440; // Friday, 1 Muharram 1 AH (July 19, 622 Gregorian - Civil Tabular)

// Leap cycle configurations
// Array of leap years in a 33-year cycle
export const SOLAR_CYCLE_LEAPS = [4, 8, 12, 16, 20, 24, 28, 33];
// Array of leap years in a 30-year tabular lunar cycle 
export const LUNAR_CYCLE_LEAPS = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];

export interface CalendarDate {
    year: number;
    month: number;
    day: number;
}

/**
 * Validates whether a given year in the 33-year cycle is a leap year.
 */
export function isSolarHijriLeapYear(year: number): boolean {
    const cycleYear = ((year - 1) % 33 + 33) % 33 + 1;
    return SOLAR_CYCLE_LEAPS.includes(cycleYear);
}

/**
 * Validates whether a given year in the 30-year cycle is a leap year.
 */
export function isLunarHijriLeapYear(year: number): boolean {
    const cycleYear = ((year - 1) % 30 + 30) % 30 + 1;
    return LUNAR_CYCLE_LEAPS.includes(cycleYear);
}

/**
 * Converts a Gregorian date to Julian Day Number.
 * Using Fliegel & Van Flandern algorithm.
 */
export function gregorianToJdn(year: number, month: number, day: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 
                Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    return jdn;
}

/**
 * Converts a Julian Day Number to a Gregorian date.
 * Using Fliegel & Van Flandern algorithm.
 */
export function jdnToGregorian(jdn: number): CalendarDate {
    const j = Math.floor(jdn) + 32044;
    const g = Math.floor(j / 146097);
    const dg = j % 146097;
    
    const c = Math.floor(((Math.floor(dg / 36524) + 1) * 3) / 4);
    const dc = dg - c * 36524;
    
    const b = Math.floor(dc / 1461);
    const db = dc % 1461;
    
    const a = Math.floor(((Math.floor(db / 365) + 1) * 3) / 4);
    const da = db - a * 365;
    
    const y = g * 400 + c * 100 + b * 4 + a;
    const m = Math.floor((da * 5 + 308) / 153) - 2;
    const d = da - Math.floor(((m + 4) * 153) / 5) + 122;
    
    const year = y - 4800 + Math.floor((m + 2) / 12);
    const month = ((m + 2) % 12) + 1;
    const day = d + 1;
    
    return { year, month, day };
}

/**
 * Converts a Solar Hijri (Shamsi) date to Julian Day Number
 * using a robust 33-year cycle logical iteration.
 */
export function solarHijriToJdn(year: number, month: number, day: number): number {
    const y = year - 1;
    const cycles = Math.floor(y / 33);
    const yearInCycle = ((y % 33) + 33) % 33;
    
    let days = cycles * 12053; // 33 years * 365 + 8 leaps
    
    for (let i = 1; i <= yearInCycle; i++) {
        days += 365 + (SOLAR_CYCLE_LEAPS.includes(i) ? 1 : 0);
    }
    
    for (let m = 1; m < month; m++) {
        if (m <= 6) days += 31;
        else if (m <= 11) days += 30;
    }
    
    days += day;
    
    return SOLAR_EPOCH_JDN - 1 + days; 
}

/**
 * Converts a Julian Day Number to a Solar Hijri (Shamsi) date.
 */
export function jdnToSolarHijri(jdn: number): CalendarDate {
    const daysSinceEpoch = Math.floor(jdn) - SOLAR_EPOCH_JDN;
    
    const cycles = Math.floor(daysSinceEpoch / 12053);
    let remainingDays = daysSinceEpoch - cycles * 12053;
    
    let yearInCycle = 1;
    while (true) {
        const yearLength = 365 + (SOLAR_CYCLE_LEAPS.includes(yearInCycle) ? 1 : 0);
        if (remainingDays < yearLength) break;
        remainingDays -= yearLength;
        yearInCycle++;
    }
    
    const year = cycles * 33 + yearInCycle;
    
    let month = 1;
    while (true) {
        const monthLength = (month <= 6) ? 31 : (month <= 11 ? 30 : (SOLAR_CYCLE_LEAPS.includes(yearInCycle) ? 30 : 29));
        if (remainingDays < monthLength) break;
        remainingDays -= monthLength;
        month++;
    }
    
    const day = remainingDays + 1;
    
    return { year, month, day };
}

/**
 * Converts a Tabular Lunar Hijri (Qamari) date to Julian Day Number.
 */
export function lunarHijriToJdn(year: number, month: number, day: number): number {
    const y = year - 1;
    const cycles = Math.floor(y / 30);
    const yearInCycle = ((y % 30) + 30) % 30;
    
    let days = cycles * 10631; // 30 years * 354 + 11 leaps
    
    for (let i = 1; i <= yearInCycle; i++) {
        days += 354 + (LUNAR_CYCLE_LEAPS.includes(i) ? 1 : 0);
    }
    
    for (let m = 1; m < month; m++) {
        days += (m % 2 === 1) ? 30 : 29;
    }
    
    days += day;
    
    return LUNAR_EPOCH_JDN - 1 + days;
}

/**
 * Converts a Julian Day Number to a Tabular Lunar Hijri (Qamari) date.
 */
export function jdnToLunarHijri(jdn: number): CalendarDate {
    const daysSinceEpoch = Math.floor(jdn) - LUNAR_EPOCH_JDN;
    
    const cycles = Math.floor(daysSinceEpoch / 10631);
    let remainingDays = daysSinceEpoch - cycles * 10631;
    
    let yearInCycle = 1;
    while (true) {
        const yearLength = 354 + (LUNAR_CYCLE_LEAPS.includes(yearInCycle) ? 1 : 0);
        if (remainingDays < yearLength) break;
        remainingDays -= yearLength;
        yearInCycle++;
    }
    
    const year = cycles * 30 + yearInCycle;
    
    let month = 1;
    while (true) {
        const isLeap = LUNAR_CYCLE_LEAPS.includes(yearInCycle);
        const monthLength = (month === 12 && isLeap) ? 30 : ((month % 2 === 1) ? 30 : 29);
        if (remainingDays < monthLength) break;
        remainingDays -= monthLength;
        month++;
    }
    
    const day = remainingDays + 1;
    
    return { year, month, day };
}

/**
 * Formats a number using native Intl overrides to stay lightweight.
 * Safely maps formats to correct locale numbering systems.
 */
export function formatNumber(num: number | string, locale: 'en' | 'fa' | 'ps'): string {
    const numericValue = typeof num === 'string' ? parseFloat(num.replace(/[^\d.-]/g, '')) : num;
    if (isNaN(numericValue)) return num.toString();

    if (locale === 'en') {
        return new Intl.NumberFormat('en-US', { useGrouping: false }).format(numericValue);
    }
    
    // fa-IR natively provides the exact Persian/Pashto digits (۰-۹) with correct Unicode points
    return new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(numericValue);
}
