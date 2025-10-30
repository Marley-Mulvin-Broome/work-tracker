import { requireUser } from '$lib/server/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserById } from '$lib/server/services/user.service';
import { getUserStats } from '$lib/server/services/stats.service';
import { getRecentActivities } from '$lib/server/services/activity.service';

export const load: PageServerLoad = async (event) => {
	const currentUser = requireUser(event);
	const userId = event.params.id;

	// Get the user we're viewing
	const viewedUser = await getUserById(userId);

	if (!viewedUser) {
		throw error(404, 'User not found');
	}

	// Get user stats
	const stats = await getUserStats(userId);

	// Get recent activities
	const recentActivities = await getRecentActivities(userId, 20);

	return {
		currentUser,
		viewedUser,
		isOwnProfile: currentUser.id === userId,
		stats,
		recentActivities
	};
};
