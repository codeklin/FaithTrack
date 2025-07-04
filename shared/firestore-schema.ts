import { z } from "zod";
import { Timestamp } from "firebase/firestore";

// Firestore document schemas
export const memberSchema = z.object({
  id: z.string().optional(), // Firestore document ID
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  membershipStatus: z.enum(["active", "inactive", "pending"]).default("active"),
  joinDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  convertedDate: z.union([z.date(), z.instanceof(Timestamp)]).default(() => new Date()),
  baptized: z.boolean().default(false),
  baptismDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  inBibleStudy: z.boolean().default(false),
  inSmallGroup: z.boolean().default(false),
  notes: z.string().optional(),
  assignedStaff: z.string().optional(),
  status: z.enum(["new", "contacted", "baptized", "active"]).default("new"),
  avatar: z.string().optional(),
  createdAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => new Date()),
  updatedAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => new Date()),
});

export const taskSchema = z.object({
  id: z.string().optional(), // Firestore document ID
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  memberId: z.string().optional(), // Reference to member document ID
  assignedTo: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  status: z.enum(["pending", "completed", "overdue"]).default("pending"),
  dueDate: z.union([z.date(), z.instanceof(Timestamp)]),
  completedDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  reminderSent: z.boolean().default(false),
  createdAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => new Date()),
  updatedAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => new Date()),
});

export const followUpSchema = z.object({
  id: z.string().optional(), // Firestore document ID
  memberId: z.string().min(1, "Member ID is required"), // Reference to member document ID
  type: z.enum(["call", "visit", "email", "text"]),
  notes: z.string().optional(),
  scheduledDate: z.union([z.date(), z.instanceof(Timestamp)]),
  completedDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  nextFollowUp: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  createdAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => new Date()),
  updatedAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => new Date()),
});

export const userSchema = z.object({
  id: z.string().optional(), // Firestore document ID (will be Firebase Auth UID)
  email: z.string().email(),
  displayName: z.string().optional(),
  role: z.enum(["admin", "staff", "volunteer"]).default("staff"),
  createdAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => new Date()),
  updatedAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => new Date()),
});

// Insert schemas (for creating new documents)
export const insertMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  membershipStatus: z.enum(["active", "inactive", "pending"]).optional().default("active"),
  joinDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  convertedDate: z.union([z.date(), z.instanceof(Timestamp)]).optional().default(() => new Date()),
  baptized: z.boolean().optional().default(false),
  baptismDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  inBibleStudy: z.boolean().optional().default(false),
  inSmallGroup: z.boolean().optional().default(false),
  notes: z.string().optional(),
  assignedStaff: z.string().optional(),
  status: z.enum(["new", "contacted", "baptized", "active"]).optional().default("new"),
  avatar: z.string().optional(),
});

export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  memberId: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).optional().default("medium"),
  status: z.enum(["pending", "completed", "overdue"]).optional().default("pending"),
  dueDate: z.union([z.date(), z.instanceof(Timestamp)]),
});

export const insertFollowUpSchema = followUpSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedDate: true,
});

export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schemas (for updating existing documents)
export const updateTaskSchema = taskSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const updateFollowUpSchema = followUpSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const updateMemberSchema = memberSchema.partial().omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type Member = z.infer<typeof memberSchema>;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type UpdateMember = z.infer<typeof updateMemberSchema>;
export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type FollowUp = z.infer<typeof followUpSchema>;
export type InsertFollowUp = z.infer<typeof insertFollowUpSchema>;
export type UpdateFollowUp = z.infer<typeof updateFollowUpSchema>;
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Stats type
export interface Stats {
  totalMembers: number;
  newConverts: number;
  baptized: number;
  inBibleStudy: number;
  inSmallGroup: number;
  activeMembers: number;
  pendingTasks: number;
  completedTasks: number;
  pendingFollowups: number;
}

// Firestore collection names
export const COLLECTIONS = {
  MEMBERS: 'members',
  TASKS: 'tasks',
  FOLLOW_UPS: 'followUps',
  USERS: 'users',
} as const;

// Helper function to convert Firestore Timestamp to Date
export const timestampToDate = (timestamp: any): Date => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

// Helper function to convert Date to Firestore Timestamp
export const dateToTimestamp = (date: Date | string): Timestamp => {
  if (typeof date === 'string') {
    return Timestamp.fromDate(new Date(date));
  }
  return Timestamp.fromDate(date);
};
