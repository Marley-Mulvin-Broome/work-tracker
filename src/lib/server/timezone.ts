/**
 * Timezone utilities for handling dates in Japanese timezone (JST - UTC+9)
 * All date comparisons and "today" calculations should use JST as source of truth
 */

export const TIMEZONE = 'Asia/Tokyo';

/**
 * Get the current date and time in Japanese timezone
 */
export function nowInJST(): Date {
	return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
}

/**
 * Get today's date at midnight in Japanese timezone
 */
export function todayInJST(): Date {
	const jstNow = nowInJST();
	jstNow.setHours(0, 0, 0, 0);
	return jstNow;
}

/**
 * Convert a date to Japanese timezone at midnight
 * @param date - The date to convert (can be Date object or date string)
 */
export function toJSTMidnight(date: Date | string): Date {
	const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
	const jstDate = new Date(dateObj.toLocaleString('en-US', { timeZone: TIMEZONE }));
	jstDate.setHours(0, 0, 0, 0);
	return jstDate;
}

/**
 * Check if two dates are the same day in Japanese timezone
 */
export function isSameDayJST(date1: Date | string, date2: Date | string): boolean {
	const jstDate1 = toJSTMidnight(date1);
	const jstDate2 = toJSTMidnight(date2);
	return jstDate1.getTime() === jstDate2.getTime();
}

/**
 * Check if a date is today in Japanese timezone
 */
export function isTodayJST(date: Date | string): boolean {
	return isSameDayJST(date, todayInJST());
}

/**
 * Get the current week range (Monday to Sunday) in Japanese timezone
 */
export function getCurrentWeekRangeJST(): { start: Date; end: Date } {
	const today = todayInJST();
	const start = new Date(today);
	const dayOfWeek = start.getDay();
	const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
	start.setDate(start.getDate() + diff);
	start.setHours(0, 0, 0, 0);

	const end = new Date(start);
	end.setDate(end.getDate() + 6);
	end.setHours(23, 59, 59, 999);

	return { start, end };
}

/**
 * Get today's date string in YYYY-MM-DD format in Japanese timezone
 */
export function getTodayDateStringJST(): string {
	const today = todayInJST();
	return today.toISOString().split('T')[0];
}

/**
 * Format a date to YYYY-MM-DD in Japanese timezone
 */
export function toDateStringJST(date: Date | string): string {
	const jstDate = toJSTMidnight(date);
	return jstDate.toISOString().split('T')[0];
}
