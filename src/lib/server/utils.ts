import { redirect, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getCurrentWeekRangeJST } from './timezone';

export function requireUser(event: RequestEvent) {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}
	return event.locals.user;
}

/**
 * Requires the user to be authenticated and an admin
 */
export function requireAdmin(event: RequestEvent) {
	const user = requireUser(event);
	if (!user.isAdmin) {
		throw error(403, 'Admin access required');
	}
	return user;
}

/**
 * Gets the current week range (Monday to Sunday) in Japanese timezone
 * @returns Object with start and end dates
 */
export function getCurrentWeekRange(): { start: Date; end: Date } {
	return getCurrentWeekRangeJST();
}

/**
 * Calculates activity duration based on input method
 * @param inputMethod - Method used to input duration ('start-end', 'start-duration', or 'date-duration')
 * @param formData - Form data containing time and duration inputs
 * @returns Object with duration, startTime, and endTime, or error object
 */
export function calculateActivityDuration(
	inputMethod: string,
	formData: FormData
): { duration: number; startTime: string | null; endTime: string | null; error?: string } {
	let duration: number;
	let startTime: string | null = null;
	let endTime: string | null = null;

	// Calculate duration based on input method
	if (inputMethod === 'start-end') {
		startTime = formData.get('startTime') as string;
		endTime = formData.get('endTime') as string;

		if (!startTime || !endTime) {
			return {
				duration: 0,
				startTime: null,
				endTime: null,
				error: 'Start time and end time are required'
			};
		}

		// Calculate duration in hours
		const [startHour, startMinute] = startTime.split(':').map(Number);
		const [endHour, endMinute] = endTime.split(':').map(Number);

		const startMinutes = startHour * 60 + startMinute;
		let endMinutes = endHour * 60 + endMinute;

		// Handle end time being on next day
		if (endMinutes < startMinutes) {
			endMinutes += 24 * 60;
		}

		duration = (endMinutes - startMinutes) / 60;

		if (duration <= 0) {
			return {
				duration: 0,
				startTime: null,
				endTime: null,
				error: 'End time must be after start time'
			};
		}
	} else if (inputMethod === 'start-duration') {
		startTime = formData.get('startTime') as string;
		const durationInput = parseFloat(formData.get('duration') as string);

		if (!startTime || !durationInput) {
			return {
				duration: 0,
				startTime: null,
				endTime: null,
				error: 'Start time and duration are required'
			};
		}

		duration = durationInput;

		// Calculate end time
		const [startHour, startMinute] = startTime.split(':').map(Number);
		const startMinutes = startHour * 60 + startMinute;
		const endMinutes = startMinutes + duration * 60;

		const endHour = Math.floor(endMinutes / 60) % 24;
		const endMinute = Math.floor(endMinutes % 60);

		endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
	} else if (inputMethod === 'date-duration') {
		const durationInput = parseFloat(formData.get('duration') as string);

		if (!durationInput) {
			return { duration: 0, startTime: null, endTime: null, error: 'Duration is required' };
		}

		duration = durationInput;
	} else {
		return { duration: 0, startTime: null, endTime: null, error: 'Invalid input method' };
	}

	return { duration, startTime, endTime };
}
