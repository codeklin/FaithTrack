import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  convertedDate: timestamp("converted_date").notNull().defaultNow(),
  baptized: boolean("baptized").default(false),
  baptismDate: timestamp("baptism_date"),
  inBibleStudy: boolean("in_bible_study").default(false),
  inSmallGroup: boolean("in_small_group").default(false),
  notes: text("notes"),
  assignedStaff: text("assigned_staff"),
  status: text("status").notNull().default("new"), // new, contacted, baptized, active
  avatar: text("avatar")
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  memberId: integer("member_id").references(() => members.id),
  assignedTo: text("assigned_to"),
  priority: text("priority").notNull().default("medium"), // high, medium, low
  status: text("status").notNull().default("pending"), // pending, completed, overdue
  dueDate: timestamp("due_date").notNull(),
  completedDate: timestamp("completed_date"),
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const followUps = pgTable("follow_ups", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  type: text("type").notNull(), // call, visit, email, text
  notes: text("notes"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  completedDate: timestamp("completed_date"),
  nextFollowUp: timestamp("next_follow_up"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  convertedDate: true
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedDate: true,
  reminderSent: true
});

export const insertFollowUpSchema = createInsertSchema(followUps).omit({
  id: true,
  createdAt: true,
  completedDate: true
});

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type FollowUp = typeof followUps.$inferSelect;
export type InsertFollowUp = z.infer<typeof insertFollowUpSchema>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
