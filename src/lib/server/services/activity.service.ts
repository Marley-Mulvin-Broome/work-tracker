import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { isTodayJST } from '$lib/server/timezone';

export interface CreateActivityInput {
	userId: string;
	name: string;
	description: string | null;
	date: Date;
	startTime: string | null;
	endTime: string | null;
	duration: number;
}

export interface UpdateActivityInput {
	id: string;
	userId: string;
	name: string;
	description: string | null;
	date: Date;
	startTime: string | null;
	endTime: string | null;
	duration: number;
}

/**
 * Get all activities for a user
 */
export async function getUserActivities(userId: string) {
	return await db
		.select()
		.from(table.activity)
		.where(eq(table.activity.userId, userId))
		.orderBy(desc(table.activity.date), desc(table.activity.createdAt));
}

/**
 * Get recent activities for a user
 */
export async function getRecentActivities(userId: string, limit: number = 10) {
	return await db
		.select()
		.from(table.activity)
		.where(eq(table.activity.userId, userId))
		.orderBy(desc(table.activity.date), desc(table.activity.createdAt))
		.limit(limit);
}

/**
 * Get a single activity by ID
 */
export async function getActivityById(activityId: string, userId: string) {
	const [activity] = await db
		.select()
		.from(table.activity)
		.where(and(eq(table.activity.id, activityId), eq(table.activity.userId, userId)));

	return activity;
}

/**
 * Create a new activity
 */
export async function createActivity(input: CreateActivityInput) {
	const [activity] = await db
		.insert(table.activity)
		.values({
			userId: input.userId,
			name: input.name,
			description: input.description,
			date: input.date,
			startTime: input.startTime,
			endTime: input.endTime,
			duration: input.duration
		})
		.returning();

	return activity;
}

/**
 * Update an existing activity
 */
export async function updateActivity(input: UpdateActivityInput) {
	const [activity] = await db
		.update(table.activity)
		.set({
			name: input.name,
			description: input.description,
			date: input.date,
			startTime: input.startTime,
			endTime: input.endTime,
			duration: input.duration,
			updatedAt: new Date()
		})
		.where(eq(table.activity.id, input.id))
		.returning();

	return activity;
}

/**
 * Delete an activity
 */
export async function deleteActivity(activityId: string) {
	await db.delete(table.activity).where(eq(table.activity.id, activityId));
}

/**
 * Check if an activity belongs to today in Japanese timezone
 */
export function isActivityFromToday(activityDate: Date): boolean {
	return isTodayJST(activityDate);
}
