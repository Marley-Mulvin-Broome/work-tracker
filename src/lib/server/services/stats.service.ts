import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sql, and, gte, lte, eq } from 'drizzle-orm';
import { getCurrentWeekRange } from '$lib/server/utils';
import { todayInJST } from '$lib/server/timezone';

export interface UserStats {
	todayHours: number;
	thisWeekHours: number;
	lastWeekHours: number;
	weekOverWeekChange: number;
}

export interface LeaderboardEntry {
	rank: number;
	userId: string;
	username: string;
	totalHours: number;
}

/**
 * Get user statistics for today, this week, and last week (in Japanese timezone)
 */
export async function getUserStats(userId: string): Promise<UserStats> {
	const today = todayInJST();

	// Get current week range (Monday to Sunday in JST)
	const { start: currentWeekStart, end: currentWeekEnd } = getCurrentWeekRange();

	// Get last week range
	const lastWeekStart = new Date(currentWeekStart);
	lastWeekStart.setDate(lastWeekStart.getDate() - 7);

	const lastWeekEnd = new Date(lastWeekStart);
	lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
	lastWeekEnd.setHours(23, 59, 59, 999);

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

	return {
		todayHours,
		thisWeekHours,
		lastWeekHours,
		weekOverWeekChange
	};
}

/**
 * Get leaderboard data for the current week
 */
export async function getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
	// Get current week range (Monday to Sunday)
	const { start: currentWeekStart, end: currentWeekEnd } = getCurrentWeekRange();

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
	return leaderboardData.map((row, index) => ({
		rank: index + 1,
		userId: row.userId,
		username: row.username,
		totalHours: Number(row.totalHours)
	}));
}

/**
 * Get the current week's date range
 */
export function getWeekDateRange(): { weekStart: string; weekEnd: string } {
	const { start, end } = getCurrentWeekRange();
	return {
		weekStart: start.toISOString().split('T')[0],
		weekEnd: end.toISOString().split('T')[0]
	};
}
