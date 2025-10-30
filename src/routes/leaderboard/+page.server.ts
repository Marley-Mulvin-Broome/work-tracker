import { requireUser } from '$lib/server/utils';
import type { PageServerLoad } from './$types';
import { getWeeklyLeaderboard, getWeekDateRange } from '$lib/server/services/stats.service';

export const load: PageServerLoad = async (event) => {
	const user = requireUser(event);

	// Get leaderboard data
	const leaderboard = await getWeeklyLeaderboard();

	// Get week date range
	const { weekStart, weekEnd } = getWeekDateRange();

	return {
		user,
		leaderboard,
		weekStart,
		weekEnd
	};
};
