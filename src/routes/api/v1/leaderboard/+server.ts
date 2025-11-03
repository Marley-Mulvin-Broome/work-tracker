import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getWeeklyLeaderboard, getWeekDateRange } from '$lib/server/services/stats.service';

/**
 * GET /api/v1/leaderboard
 * Returns the weekly leaderboard with all users ranked by hours worked this week
 */
export const GET: RequestHandler = async () => {
	// Get leaderboard data
	const leaderboard = await getWeeklyLeaderboard();

	// Get week date range
	const { weekStart, weekEnd } = getWeekDateRange();

	return json({
		success: true,
		data: {
			leaderboard,
			weekStart,
			weekEnd
		}
	});
};
