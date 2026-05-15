import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { projects } from './projects'

export const roleEnum = pgEnum('message_role', ['user', 'assistant', 'system'])
export const modeEnum = pgEnum('message_mode', ['plan', 'build'])

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  content: text('content').notNull(),
  mode: modeEnum('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
