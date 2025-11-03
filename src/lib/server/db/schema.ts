import {
	pgTable,
	text,
	timestamp,
	uuid,
	index,
	time,
	date,
	real,
	boolean
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isAdmin: boolean('is_admin').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const activity = pgTable(
	'activity',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		name: text('name').notNull(),
		description: text('description'),
		date: date('date', { mode: 'date' }).notNull(),
		startTime: time('start_time'),
		endTime: time('end_time'),
		duration: real('duration').notNull(), // duration in hours
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(table) => ({
		userIdIdx: index('activity_user_id_idx').on(table.userId),
		dateIdx: index('activity_date_idx').on(table.date),
		userIdDateIdx: index('activity_user_id_date_idx').on(table.userId, table.date)
	})
);

export const apiKey = pgTable(
	'api_key',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		keyHash: text('key_hash').notNull().unique(),
		lastUsed: timestamp('last_used', { withTimezone: true, mode: 'date' }),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(table) => ({
		userIdIdx: index('api_key_user_id_idx').on(table.userId)
	})
);

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Activity = typeof activity.$inferSelect;
export type ActivityInsert = typeof activity.$inferInsert;
export type ApiKey = typeof apiKey.$inferSelect;
export type ApiKeyInsert = typeof apiKey.$inferInsert;
