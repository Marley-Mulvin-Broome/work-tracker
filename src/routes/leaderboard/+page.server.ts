import { requireUser } from '$lib/server/utils';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sql, and, gte, lte, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = requireUser(event);

	// Get Monday of current week
	const today = new Date();
	const currentWeekStart = new Date(today);
	const dayOfWeek = currentWeekStart.getDay();
	const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
	currentWeekStart.setDate(currentWeekStart.getDate() + diff);
	currentWeekStart.setHours(0, 0, 0, 0);

	const currentWeekEnd = new Date(currentWeekStart);
	currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

	// Get leaderboard data - aggregate hours per user for current week
	const leaderboardData = await db
		.select({
			userId: table.user.id,
			username: table.user.username,
			totalHours: sql<number>`coalesce(sum(${table.activity.duration}), 0)`
		})
		.from(table.user)
		.leftJoin(
			table.activity,
			and(
				eq(table.user.id, table.activity.userId),
				gte(table.activity.date, currentWeekStart),
				lte(table.activity.date, currentWeekEnd)
			)
		)
		.groupBy(table.user.id, table.user.username)
		.orderBy(sql`coalesce(sum(${table.activity.duration}), 0) DESC`);

	// Convert to proper format and add rank
	const leaderboard = leaderboardData.map((row, index) => ({
		rank: index + 1,
		userId: row.userId,
		username: row.username,
		totalHours: Number(row.totalHours)
	}));

	return {
		user,
		leaderboard,
		weekStart: currentWeekStart.toISOString().split('T')[0],
		weekEnd: currentWeekEnd.toISOString().split('T')[0],
	};
};
