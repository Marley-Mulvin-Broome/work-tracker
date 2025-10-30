import { requireUser } from '$lib/server/utils';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = requireUser(event);

	const activities = await db
		.select()
		.from(table.activity)
		.where(eq(table.activity.userId, user.id))
		.orderBy(desc(table.activity.date), desc(table.activity.createdAt));

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

		let duration: number;
		let startTime: string | null = null;
		let endTime: string | null = null;

		// Calculate duration based on input method
		if (inputMethod === 'start-end') {
			startTime = formData.get('startTime') as string;
			endTime = formData.get('endTime') as string;

			if (!startTime || !endTime) {
				return fail(400, { message: 'Start time and end time are required' });
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
				return fail(400, { message: 'End time must be after start time' });
			}
		} else if (inputMethod === 'start-duration') {
			startTime = formData.get('startTime') as string;
			const durationInput = parseFloat(formData.get('duration') as string);

			if (!startTime || !durationInput) {
				return fail(400, { message: 'Start time and duration are required' });
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
				return fail(400, { message: 'Duration is required' });
			}

			duration = durationInput;
		} else {
			return fail(400, { message: 'Invalid input method' });
		}

		try {
			await db.insert(table.activity).values({
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
			return fail(500, { message: 'Failed to create activity' });
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
		const [existing] = await db
			.select()
			.from(table.activity)
			.where(and(eq(table.activity.id, id), eq(table.activity.userId, user.id)));

		if (!existing) {
			return fail(404, { message: 'Activity not found' });
		}

		// Check if activity is from today
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const existingDate = new Date(existing.date);
		existingDate.setHours(0, 0, 0, 0);
		
		if (existingDate.getTime() !== today.getTime()) {
			return fail(403, { message: 'Can only edit activities from today' });
		}

		// Convert string date to Date object
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);

		let duration: number;
		let startTime: string | null = null;
		let endTime: string | null = null;

		// Calculate duration based on input method (same logic as create)
		if (inputMethod === 'start-end') {
			startTime = formData.get('startTime') as string;
			endTime = formData.get('endTime') as string;

			if (!startTime || !endTime) {
				return fail(400, { message: 'Start time and end time are required' });
			}

			const [startHour, startMinute] = startTime.split(':').map(Number);
			const [endHour, endMinute] = endTime.split(':').map(Number);

			const startMinutes = startHour * 60 + startMinute;
			let endMinutes = endHour * 60 + endMinute;

			if (endMinutes < startMinutes) {
				endMinutes += 24 * 60;
			}

			duration = (endMinutes - startMinutes) / 60;

			if (duration <= 0) {
				return fail(400, { message: 'End time must be after start time' });
			}
		} else if (inputMethod === 'start-duration') {
			startTime = formData.get('startTime') as string;
			const durationInput = parseFloat(formData.get('duration') as string);

			if (!startTime || !durationInput) {
				return fail(400, { message: 'Start time and duration are required' });
			}

			duration = durationInput;

			const [startHour, startMinute] = startTime.split(':').map(Number);
			const startMinutes = startHour * 60 + startMinute;
			const endMinutes = startMinutes + duration * 60;

			const endHour = Math.floor(endMinutes / 60) % 24;
			const endMinute = Math.floor(endMinutes % 60);

			endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
		} else if (inputMethod === 'date-duration') {
			const durationInput = parseFloat(formData.get('duration') as string);

			if (!durationInput) {
				return fail(400, { message: 'Duration is required' });
			}

			duration = durationInput;
		} else {
			return fail(400, { message: 'Invalid input method' });
		}

		try {
			await db
				.update(table.activity)
				.set({
					name,
					description: description || null,
					date,
					startTime,
					endTime,
					duration,
					updatedAt: new Date()
				})
				.where(eq(table.activity.id, id));

			return { success: true };
		} catch (error) {
			console.error('Error updating activity:', error);
			return fail(500, { message: 'Failed to update activity' });
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
		const [existing] = await db
			.select()
			.from(table.activity)
			.where(and(eq(table.activity.id, id), eq(table.activity.userId, user.id)));

		if (!existing) {
			return fail(404, { message: 'Activity not found' });
		}

		// Check if activity is from today
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const existingDate = new Date(existing.date);
		existingDate.setHours(0, 0, 0, 0);
		
		if (existingDate.getTime() !== today.getTime()) {
			return fail(403, { message: 'Can only delete activities from today' });
		}

		try {
			await db.delete(table.activity).where(eq(table.activity.id, id));

			return { success: true };
		} catch (error) {
			console.error('Error deleting activity:', error);
			return fail(500, { message: 'Failed to delete activity' });
		}
	}
};
