import { requireAdmin } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getAllUsers,
	searchUsers,
	createUser,
	deleteUser
} from '$lib/server/services/user.service';
import {
	getAllApiKeys,
	createApiKey,
	deleteApiKey
} from '$lib/server/services/apikey.service';

export const load: PageServerLoad = async (event) => {
	const user = requireAdmin(event);
	const searchQuery = event.url.searchParams.get('search') || '';

	// Get users (search if query provided)
	const users = searchQuery ? await searchUsers(searchQuery) : await getAllUsers();

	// Get all API keys
	const apiKeys = await getAllApiKeys();

	return {
		user,
		users,
		apiKeys,
		searchQuery
	};
};

export const actions: Actions = {
	createUser: async (event) => {
		requireAdmin(event);
		const formData = await event.request.formData();

		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const isAdmin = formData.get('isAdmin') === 'on';

		// Validation
		if (!username || !password) {
			return fail(400, { message: 'Username and password are required' });
		}

		if (username.length < 3 || username.length > 31) {
			return fail(400, { message: 'Username must be between 3 and 31 characters' });
		}

		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			return fail(400, { message: 'Username can only contain letters, numbers, and underscores' });
		}

		if (password.length < 6 || password.length > 255) {
			return fail(400, { message: 'Password must be between 6 and 255 characters' });
		}

		try {
			await createUser({ username, password, isAdmin });
			return { success: true, message: 'User created successfully' };
		} catch (error) {
			console.error('Error creating user:', error);

			if (error instanceof Error) {
				if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
					return fail(400, { message: 'Username already exists' });
				}
			}

			return fail(500, { message: 'Failed to create user' });
		}
	},

	deleteUser: async (event) => {
		const admin = requireAdmin(event);
		const formData = await event.request.formData();

		const userId = formData.get('userId') as string;

		if (!userId) {
			return fail(400, { message: 'User ID is required' });
		}

		// Prevent self-deletion
		if (userId === admin.id) {
			return fail(400, { message: 'You cannot delete your own account' });
		}

		try {
			await deleteUser(userId);
			return { success: true, message: 'User deleted successfully' };
		} catch (error) {
			console.error('Error deleting user:', error);
			return fail(500, { message: 'Failed to delete user' });
		}
	},

	createApiKey: async (event) => {
		const admin = requireAdmin(event);
		const formData = await event.request.formData();

		const name = formData.get('name') as string;
		const userId = formData.get('userId') as string || admin.id;

		if (!name) {
			return fail(400, { message: 'API key name is required' });
		}

		try {
			const result = await createApiKey({ userId, name });
			return {
				success: true,
				message: 'API key created successfully',
				apiKey: result.apiKey
			};
		} catch (error) {
			console.error('Error creating API key:', error);
			return fail(500, { message: 'Failed to create API key' });
		}
	},

	deleteApiKey: async (event) => {
		requireAdmin(event);
		const formData = await event.request.formData();

		const apiKeyId = formData.get('apiKeyId') as string;

		if (!apiKeyId) {
			return fail(400, { message: 'API key ID is required' });
		}

		try {
			await deleteApiKey(apiKeyId);
			return { success: true, message: 'API key deleted successfully' };
		} catch (error) {
			console.error('Error deleting API key:', error);
			return fail(500, { message: 'Failed to delete API key' });
		}
	}
};
