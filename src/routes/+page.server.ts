import { requireUser } from '$lib/server/utils';
import type { PageServerLoad } from './$types';
import { getUserStats } from '$lib/server/services/stats.service';
import { getRecentActivities, getYearActivityData } from '$lib/server/services/activity.service';

export const load: PageServerLoad = async (event) => {
	const user = requireUser(event);

	// Get user stats
	const stats = await getUserStats(user.id);

	// Get recent activities
	const recentActivities = await getRecentActivities(user.id, 10);

	// Get year activity data for calendar
	const currentYear = new Date().getFullYear();
	const yearActivities = await getYearActivityData(user.id, currentYear);

	return {
		user,
		stats,
		recentActivities,
		yearActivities
	};
};
