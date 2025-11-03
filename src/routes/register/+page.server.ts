import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { createUser, hasAnyUsers } from '$lib/server/services/user.service';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// If user is already logged in, redirect to home
	if (event.locals.user) {
		return redirect(302, '/');
	}

	// If users already exist, redirect to login
	const usersExist = await hasAnyUsers();
	if (usersExist) {
		return redirect(302, '/login');
	}

	return {};
};

export const actions: Actions = {
	register: async (event) => {
		// Double-check that no users exist
		const usersExist = await hasAnyUsers();
		if (usersExist) {
			return fail(403, {
				message: 'Registration is closed. Users already exist in the system.'
			});
		}

		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric and underscore only)'
			});
		}

		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match' });
		}

		try {
			// Create the admin user
			const user = await createUser({
				username,
				password,
				isAdmin: true // First user is always an admin
			});

			// Create session and log them in
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, user.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, {
				message: 'An error occurred during registration. Please try again.'
			});
		}

		return redirect(302, '/');
	}
};

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-zA-Z0-9_]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
