import { pgTable, uuid, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'
import { projects } from './projects'

export const creditTypeEnum = pgEnum('credit_type', ['debit', 'credit'])

// Append-only ledger — never update or delete rows
export const creditLedger = pgTable('credit_ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: creditTypeEnum('type').notNull(),
  amount: integer('amount').notNull(),        // always positive
  reason: text('reason').notNull(),           // 'prompt' | 'subscription' | 'manual' | 'topup'
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
})
