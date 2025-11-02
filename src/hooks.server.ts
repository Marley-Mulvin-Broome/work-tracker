import type { Handle, ServerInit } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { client, db } from '$lib/server/db';

const handleAuth: Handle = async ({ event, resolve }) => {
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

export const init: ServerInit = async () => {
	console.log('Migration started');

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
		client.end();
	}
};

export const handle: Handle = handleAuth;
