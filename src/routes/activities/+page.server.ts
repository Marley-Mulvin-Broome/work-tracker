import { requireUser, calculateActivityDuration } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getUserActivities,
	getActivityById,
	createActivity,
	updateActivity,
	deleteActivity,
	isActivityFromToday
} from '$lib/server/services/activity.service';

export const load: PageServerLoad = async (event) => {
	const user = requireUser(event);

	const activities = await getUserActivities(user.id);

	return {
		user,
		activities
	};
};

export const actions: Actions = {
	create: async (event) => {
		const user = requireUser(event);
		const formData = await event.request.formData();

		const name = formData.get('name') as string;
		const description = formData.get('description') as string | null;
		const inputMethod = formData.get('inputMethod') as string;
		const dateStr = formData.get('date') as string;

		if (!name || !dateStr) {
			return fail(400, { message: 'Name and date are required' });
		}

		// Convert string date to Date object
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);

		// Calculate duration based on input method
		const result = calculateActivityDuration(inputMethod, formData);
		if (result.error) {
			return fail(400, { message: result.error });
		}

		const { duration, startTime, endTime } = result;

		try {
			await createActivity({
				userId: user.id,
				name,
				description: description || null,
				date,
				startTime,
				endTime,
				duration
			});

			return { success: true };
		} catch (error) {
			console.error('Error creating activity:', error);
			
			// Handle specific database errors
			if (error instanceof Error) {
				if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
					return fail(400, { message: 'An activity with this information already exists.' });
				}
				if (error.message.includes('foreign key') || error.message.includes('violates')) {
					return fail(400, { message: 'Invalid user reference.' });
				}
			}
			
			return fail(500, { message: 'Failed to create activity. Please try again.' });
		}
	},

	update: async (event) => {
		const user = requireUser(event);
		const formData = await event.request.formData();

		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const description = formData.get('description') as string | null;
		const inputMethod = formData.get('inputMethod') as string;
		const dateStr = formData.get('date') as string;

		if (!id || !name || !dateStr) {
			return fail(400, { message: 'ID, name, and date are required' });
		}

		// Check if activity exists and belongs to user
		const existing = await getActivityById(id, user.id);

		if (!existing) {
			return fail(404, { message: 'Activity not found' });
		}

		// Check if activity is from today
		if (!isActivityFromToday(existing.date)) {
			return fail(403, { message: 'Can only edit activities from today' });
		}

		// Convert string date to Date object
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);

		// Calculate duration based on input method
		const result = calculateActivityDuration(inputMethod, formData);
		if (result.error) {
			return fail(400, { message: result.error });
		}

		const { duration, startTime, endTime } = result;

		try {
			await updateActivity({
				id,
				userId: user.id,
				name,
				description: description || null,
				date,
				startTime,
				endTime,
				duration
			});

			return { success: true };
		} catch (error) {
			console.error('Error updating activity:', error);
			
			// Handle specific database errors
			if (error instanceof Error) {
				if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
					return fail(400, { message: 'An activity with this information already exists.' });
				}
				if (error.message.includes('foreign key') || error.message.includes('violates')) {
					return fail(400, { message: 'Invalid user reference.' });
				}
			}
			
			return fail(500, { message: 'Failed to update activity. Please try again.' });
		}
	},

	delete: async (event) => {
		const user = requireUser(event);
		const formData = await event.request.formData();

		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'ID is required' });
		}

		// Check if activity exists and belongs to user
		const existing = await getActivityById(id, user.id);

		if (!existing) {
			return fail(404, { message: 'Activity not found' });
		}

		// Check if activity is from today
		if (!isActivityFromToday(existing.date)) {
			return fail(403, { message: 'Can only delete activities from today' });
		}

		try {
			await deleteActivity(id);

			return { success: true };
		} catch (error) {
			console.error('Error deleting activity:', error);
			return fail(500, { message: 'Failed to delete activity' });
		}
	}
};
