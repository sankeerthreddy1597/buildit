import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

export const projectStatusEnum = pgEnum('project_status', [
  'planning',
  'building',
  'ready',
  'error',
])

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: projectStatusEnum('status').default('planning').notNull(),
  plan: text('plan'),                         // JSON: structured plan from planner agent
  starterKitArgs: text('starter_kit_args'),   // e.g. "--features auth,db"
  sandboxId: text('sandbox_id'),
  previewUrl: text('preview_url'),
  githubRepoUrl: text('github_repo_url'),     // Pro
  vercelDeployUrl: text('vercel_deploy_url'), // Pro
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
