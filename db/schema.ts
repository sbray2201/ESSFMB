import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import type { Progress } from '../src/data.js';
export const learners = pgTable('learners', {
  id: text('id').primaryKey(),
  progress: jsonb('progress').$type<Progress>().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
