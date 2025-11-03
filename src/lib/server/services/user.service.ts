import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, ilike } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export interface CreateUserInput {
	username: string;
	password: string;
	isAdmin?: boolean;
}

/**
 * Get a user by ID
 */
export async function getUserById(userId: string) {
	const [user] = await db.select().from(table.user).where(eq(table.user.id, userId));
	return user;
}

/**
 * Get a user by username
 */
export async function getUserByUsername(username: string) {
	const [user] = await db.select().from(table.user).where(eq(table.user.username, username));
	return user;
}

/**
 * Get all users
 */
export async function getAllUsers() {
	return await db.select().from(table.user);
}

/**
 * Search users by username (case-insensitive)
 */
export async function searchUsers(query: string) {
	if (!query || query.trim() === '') {
		return await getAllUsers();
	}

	return await db
		.select()
		.from(table.user)
		.where(ilike(table.user.username, `%${query}%`));
}

/**
 * Create a new user (admin only)
 */
export async function createUser(input: CreateUserInput) {
	const passwordHash = await hash(input.password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const userId = encodeBase32LowerCase(bytes);

	const [user] = await db
		.insert(table.user)
		.values({
			id: userId,
			username: input.username,
			passwordHash,
			isAdmin: input.isAdmin ?? false
		})
		.returning();

	return user;
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string) {
	// Delete user (cascade will handle sessions and activities)
	await db.delete(table.user).where(eq(table.user.id, userId));
}

/**
 * Update a user's password (admin only)
 */
export async function updateUserPassword(userId: string, newPassword: string) {
	const passwordHash = await hash(newPassword, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	await db.update(table.user).set({ passwordHash }).where(eq(table.user.id, userId));
}

/**
 * Check if a user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
	const user = await getUserById(userId);
	return user?.isAdmin ?? false;
}
