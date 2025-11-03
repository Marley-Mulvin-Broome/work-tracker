import { error, type Handle, type ServerInit } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '$lib/server/db';
import { dev } from '$app/environment';
import { validateApiKey } from '$lib/server/services';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api') || event.url.pathname.startsWith('/health'))
		return resolve(event);

	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

const handleAPIAuth: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith('/api')) return resolve(event);

	const apiKey = event.request.headers.get('Authorization')?.replace('Bearer ', '');

	if (!apiKey) return error(401, 'Unauthorized');

	const user = await validateApiKey(apiKey);

	if (!user) return error(401, 'Unauthorized');

	event.locals.user = user;
	return resolve(event);
};

export const init: ServerInit = async () => {
	if (dev) {
		console.log('Skipping migrations in dev mode');
		return;
	}
	console.log('Migration started');

	try {
		await migrate(db, { migrationsFolder: './drizzle' });
		console.log('Migration completed successfully');
	} catch (error) {
		console.error('Migration error:', error);
		throw error;
	}
};

export const handle: Handle = sequence(handleAuth, handleAPIAuth);
