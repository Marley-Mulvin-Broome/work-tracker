import { requireUser } from '$lib/server/utils';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const currentUser = requireUser(event);
	const userId = event.params.id;

	// Get the user we're viewing
	const [viewedUser] = await db.select().from(table.user).where(eq(table.user.id, userId));

	if (!viewedUser) {
		throw error(404, 'User not found');
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Get Monday of current week
	const currentWeekStart = new Date(today);
	const dayOfWeek = currentWeekStart.getDay();
	const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
	currentWeekStart.setDate(currentWeekStart.getDate() + diff);

	const currentWeekEnd = new Date(currentWeekStart);
	currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

	// Get Monday of last week
	const lastWeekStart = new Date(currentWeekStart);
	lastWeekStart.setDate(lastWeekStart.getDate() - 7);

	const lastWeekEnd = new Date(lastWeekStart);
	lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);

	// Get today's hours
	const todayResult = await db
		.select({ total: sql<number>`coalesce(sum(${table.activity.duration}), 0)` })
		.from(table.activity)
		.where(and(eq(table.activity.userId, userId), eq(table.activity.date, today)));

	const todayHours = Number(todayResult[0]?.total ?? 0);

	// Get this week's hours
	const thisWeekResult = await db
		.select({ total: sql<number>`coalesce(sum(${table.activity.duration}), 0)` })
		.from(table.activity)
		.where(
			and(
				eq(table.activity.userId, userId),
				gte(table.activity.date, currentWeekStart),
				lte(table.activity.date, currentWeekEnd)
			)
		);

	const thisWeekHours = Number(thisWeekResult[0]?.total ?? 0);

	// Get last week's hours
	const lastWeekResult = await db
		.select({ total: sql<number>`coalesce(sum(${table.activity.duration}), 0)` })
		.from(table.activity)
		.where(
			and(
				eq(table.activity.userId, userId),
				gte(table.activity.date, lastWeekStart),
				lte(table.activity.date, lastWeekEnd)
			)
		);

	const lastWeekHours = Number(lastWeekResult[0]?.total ?? 0);

	// Calculate week-over-week change
	const weekOverWeekChange =
		lastWeekHours > 0 ? ((thisWeekHours - lastWeekHours) / lastWeekHours) * 100 : 0;

	// Get recent activities
	const recentActivities = await db
		.select()
		.from(table.activity)
		.where(eq(table.activity.userId, userId))
		.orderBy(desc(table.activity.date), desc(table.activity.createdAt))
		.limit(20);

	return {
		currentUser,
		viewedUser,
		isOwnProfile: currentUser.id === userId,
		stats: {
			todayHours,
			thisWeekHours,
			lastWeekHours,
			weekOverWeekChange
		},
		recentActivities
	};
};
