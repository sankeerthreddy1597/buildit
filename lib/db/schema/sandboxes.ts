import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { projects } from './projects'

export const sandboxStatusEnum = pgEnum('sandbox_status', [
  'provisioning',
  'running',
  'idle',
  'stopped',
  'error',
])

export const sandboxes = pgTable('sandboxes', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  e2bSandboxId: text('e2b_sandbox_id').notNull().unique(),
  status: sandboxStatusEnum('status').default('provisioning').notNull(),
  previewUrl: text('preview_url'),
  region: text('region').default('us-east'),
  expiresAt: timestamp('expires_at'),   // sandbox TTL (2h from last activity)
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
