import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase, encodeBase32LowerCase } from '@oslojs/encoding';

export interface CreateApiKeyInput {
	userId: string;
	name: string;
}

/**
 * Generate a new API key
 */
function generateApiKey(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return encodeBase32LowerCase(bytes);
}

/**
 * Hash an API key for storage
 */
function hashApiKey(key: string): string {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(key)));
}

/**
 * Create a new API key
 * @returns Object with the API key and its database record (without the plain key stored)
 */
export async function createApiKey(
	input: CreateApiKeyInput
): Promise<{ apiKey: string; record: table.ApiKey }> {
	const apiKey = generateApiKey();
	const keyHash = hashApiKey(apiKey);

	const [record] = await db
		.insert(table.apiKey)
		.values({
			userId: input.userId,
			name: input.name,
			keyHash
		})
		.returning();

	return { apiKey, record };
}

/**
 * Get all API keys for a user
 */
export async function getUserApiKeys(userId: string) {
	return await db.select().from(table.apiKey).where(eq(table.apiKey.userId, userId));
}

/**
 * Get all API keys (admin only)
 */
export async function getAllApiKeys() {
	return await db
		.select({
			id: table.apiKey.id,
			userId: table.apiKey.userId,
			username: table.user.username,
			name: table.apiKey.name,
			lastUsed: table.apiKey.lastUsed,
			createdAt: table.apiKey.createdAt
		})
		.from(table.apiKey)
		.innerJoin(table.user, eq(table.apiKey.userId, table.user.id));
}

/**
 * Delete an API key
 */
export async function deleteApiKey(apiKeyId: string) {
	await db.delete(table.apiKey).where(eq(table.apiKey.id, apiKeyId));
}

/**
 * Validate an API key and return the associated user
 */
export async function validateApiKey(apiKey: string) {
	const keyHash = hashApiKey(apiKey);

	const [result] = await db
		.select({
			apiKey: table.apiKey,
			user: table.user
		})
		.from(table.apiKey)
		.innerJoin(table.user, eq(table.apiKey.userId, table.user.id))
		.where(eq(table.apiKey.keyHash, keyHash));

	if (!result) {
		return null;
	}

	// Update last used timestamp
	await db
		.update(table.apiKey)
		.set({ lastUsed: new Date() })
		.where(eq(table.apiKey.id, result.apiKey.id));

	return result.user;
}
