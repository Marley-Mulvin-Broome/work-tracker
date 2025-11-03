import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserById } from '$lib/server/services/user.service';
import { getUserStats } from '$lib/server/services/stats.service';

/**
 * GET /api/v1/user/:id
 * Returns statistics for a specific user by their ID
 */
export const GET: RequestHandler = async ({ params }) => {
	const userId = params.id;

	// Get user information
	const user = await getUserById(userId);

	if (!user) {
		return error(404, 'User not found');
	}

	// Get user statistics
	const stats = await getUserStats(userId);

	return json({
		success: true,
		data: {
			user: {
				id: user.id,
				username: user.username
			},
			stats: {
				todayHours: stats.todayHours,
				thisWeekHours: stats.thisWeekHours,
				lastWeekHours: stats.lastWeekHours,
				weekOverWeekChange: stats.weekOverWeekChange
			}
		}
	});
};
