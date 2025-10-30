import { requireUser } from '$lib/server/utils';
import type { PageServerLoad } from './$types';
import { getUserStats } from '$lib/server/services/stats.service';
import { getRecentActivities } from '$lib/server/services/activity.service';

export const load: PageServerLoad = async (event) => {
	const user = requireUser(event);

	// Get user stats
	const stats = await getUserStats(user.id);

	// Get recent activities
	const recentActivities = await getRecentActivities(user.id, 10);

	return {
		user,
		stats,
		recentActivities
	};
};
