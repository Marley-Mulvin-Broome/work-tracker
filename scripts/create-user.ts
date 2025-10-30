import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { db } from '../src/lib/server/db/index.js';
import * as table from '../src/lib/server/db/schema.js';

async function createUser(username: string, password: string) {
	// Generate user ID
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const userId = encodeBase32LowerCase(bytes);

	// Hash password
	const passwordHash = await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	try {
		await db.insert(table.user).values({
			id: userId,
			username,
			passwordHash
		});
		console.log(`✅ User created successfully!`);
		console.log(`   Username: ${username}`);
		console.log(`   User ID: ${userId}`);
	} catch (error) {
		console.error('❌ Error creating user:', error instanceof Error ? error.message : 'Unknown error');
		process.exit(1);
	}

	process.exit(0);
}

// Get username and password from command line arguments
const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
	console.error('Usage: tsx scripts/create-user.ts <username> <password>');
	console.error('Example: tsx scripts/create-user.ts john mypassword123');
	process.exit(1);
}

if (username.length < 3 || username.length > 31) {
	console.error('❌ Username must be between 3 and 31 characters');
	process.exit(1);
}

if (!/^[a-zA-Z0-9_]+$/.test(username)) {
	console.error('❌ Username can only contain letters, numbers, and underscores');
	process.exit(1);
}

if (password.length < 6 || password.length > 255) {
	console.error('❌ Password must be between 6 and 255 characters');
	process.exit(1);
}

console.log(`Creating user: ${username}...`);
createUser(username, password);
