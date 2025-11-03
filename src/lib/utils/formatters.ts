/**
 * Formats hours into human-readable string (e.g., "2h 30m")
 * @param hours - Number of hours (decimal)
 * @returns Formatted string
 */
export function formatHours(hours: number): string {
	if (hours === 0) return '0h';
	const h = Math.floor(hours);
	const m = Math.round((hours - h) * 60);
	if (m === 0) return `${h}h`;
	return `${h}h ${m}m`;
}

/**
 * Formats a date string or Date object into a localized date format in Japanese timezone
 * @param date - Date string in ISO format or Date object
 * @returns Formatted date string (e.g., "Jan 1, 2024")
 */
export function formatDate(date: string | Date): string {
	const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
	// Format in Japanese timezone
	return dateObj.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'Asia/Tokyo'
	});
}

/**
 * Formats a time string into 12-hour format
 * @param timeStr - Time string in HH:MM format or null
 * @returns Formatted time string (e.g., "2:30 PM") or "-" if null
 */
export function formatTime(timeStr: string | null): string {
	if (!timeStr) return '-';
	const [hours, minutes] = timeStr.split(':').map(Number);
	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHours = hours % 12 || 12;
	return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
