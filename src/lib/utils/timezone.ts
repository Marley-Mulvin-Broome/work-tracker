/**
 * Client-side timezone utilities for Japanese timezone (JST - UTC+9)
 */

export const TIMEZONE = 'Asia/Tokyo';

/**
 * Get today's date in JST timezone formatted as YYYY-MM-DD
 * This is used for date inputs to default to JST "today"
 */
export function getTodayJST(): string {
	const now = new Date();
	// Convert to JST
	const jstDate = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }));
	// Format as YYYY-MM-DD
	const year = jstDate.getFullYear();
	const month = String(jstDate.getMonth() + 1).padStart(2, '0');
	const day = String(jstDate.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * Check if a date is today in JST
 */
export function isTodayJST(date: Date | string): boolean {
	const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
	const today = getTodayJST();
	const checkDate = new Date(dateObj.toLocaleString('en-US', { timeZone: TIMEZONE }));
	const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
	return checkDateStr === today;
}
