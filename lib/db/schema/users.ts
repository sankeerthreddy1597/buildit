import { pgTable, uuid, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const planEnum = pgEnum('plan', ['free', 'pro'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),                         // mirrors Supabase auth.users.id
  email: text('email').notNull().unique(),
  plan: planEnum('plan').default('free').notNull(),
  creditBalance: integer('credit_balance').default(50).notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  githubAccessToken: text('github_access_token'),      // Pro only — store encrypted
  createdAt: timestamp('created_at').defaultNow(),
})
