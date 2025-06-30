import { users, members, tasks, followUps, type User, type InsertUser, type Member, type InsertMember, type Task, type InsertTask, type FollowUp, type InsertFollowUp } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lte, count, isNull } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Member methods
  getMembers(): Promise<Member[]>;
  getMember(id: number): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, member: Partial<InsertMember>): Promise<Member | undefined>;
  deleteMember(id: number): Promise<boolean>;
  getRecentMembers(limit?: number): Promise<Member[]>;

  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTasksByMember(memberId: number): Promise<Task[]>;
  getUrgentTasks(): Promise<Task[]>;
  getPendingTasks(): Promise<Task[]>;
  completeTask(id: number): Promise<Task | undefined>;

  // Follow-up methods
  getFollowUps(): Promise<FollowUp[]>;
  getFollowUp(id: number): Promise<FollowUp | undefined>;
  createFollowUp(followUp: InsertFollowUp): Promise<FollowUp>;
  updateFollowUp(id: number, followUp: Partial<InsertFollowUp>): Promise<FollowUp | undefined>;
  deleteFollowUp(id: number): Promise<boolean>;
  getFollowUpsByMember(memberId: number): Promise<FollowUp[]>;
  getUpcomingFollowUps(): Promise<FollowUp[]>;

  // Stats methods
  getStats(): Promise<{
    newConverts: number;
    pendingFollowups: number;
    completedTasks: number;
    activeMembers: number;
    baptized: number;
    inBibleStudy: number;
    inSmallGroup: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getMembers(): Promise<Member[]> {
    return await db.select().from(members).orderBy(desc(members.convertedDate));
  }

  async getMember(id: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async createMember(member: InsertMember): Promise<Member> {
    const [newMember] = await db
      .insert(members)
      .values(member)
      .returning();
    return newMember;
  }

  async updateMember(id: number, member: Partial<InsertMember>): Promise<Member | undefined> {
    const [updatedMember] = await db
      .update(members)
      .set(member)
      .where(eq(members.id, id))
      .returning();
    return updatedMember || undefined;
  }

  async deleteMember(id: number): Promise<boolean> {
    // Delete related tasks and follow-ups first
    await db.delete(tasks).where(eq(tasks.memberId, id));
    await db.delete(followUps).where(eq(followUps.memberId, id));
    
    const result = await db.delete(members).where(eq(members.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getRecentMembers(limit: number = 5): Promise<Member[]> {
    return await db
      .select()
      .from(members)
      .orderBy(desc(members.convertedDate))
      .limit(limit);
  }

  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(task)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTasksByMember(memberId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.memberId, memberId))
      .orderBy(desc(tasks.createdAt));
  }

  async getUrgentTasks(): Promise<Task[]> {
    const now = new Date();
    return await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.status, "pending"),
          lte(tasks.dueDate, now)
        )
      )
      .orderBy(tasks.dueDate);
  }

  async getPendingTasks(): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.status, "pending"))
      .orderBy(tasks.dueDate);
  }

  async completeTask(id: number): Promise<Task | undefined> {
    const [completedTask] = await db
      .update(tasks)
      .set({ 
        status: "completed",
        completedDate: new Date()
      })
      .where(eq(tasks.id, id))
      .returning();
    return completedTask || undefined;
  }

  async getFollowUps(): Promise<FollowUp[]> {
    return await db.select().from(followUps).orderBy(desc(followUps.scheduledDate));
  }

  async getFollowUp(id: number): Promise<FollowUp | undefined> {
    const [followUp] = await db.select().from(followUps).where(eq(followUps.id, id));
    return followUp || undefined;
  }

  async createFollowUp(followUp: InsertFollowUp): Promise<FollowUp> {
    const [newFollowUp] = await db
      .insert(followUps)
      .values(followUp)
      .returning();
    return newFollowUp;
  }

  async updateFollowUp(id: number, followUp: Partial<InsertFollowUp>): Promise<FollowUp | undefined> {
    const [updatedFollowUp] = await db
      .update(followUps)
      .set(followUp)
      .where(eq(followUps.id, id))
      .returning();
    return updatedFollowUp || undefined;
  }

  async deleteFollowUp(id: number): Promise<boolean> {
    const result = await db.delete(followUps).where(eq(followUps.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getFollowUpsByMember(memberId: number): Promise<FollowUp[]> {
    return await db
      .select()
      .from(followUps)
      .where(eq(followUps.memberId, memberId))
      .orderBy(desc(followUps.scheduledDate));
  }

  async getUpcomingFollowUps(): Promise<FollowUp[]> {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return await db
      .select()
      .from(followUps)
      .where(
        and(
          lte(followUps.scheduledDate, tomorrow),
          isNull(followUps.completedDate)
        )
      )
      .orderBy(followUps.scheduledDate);
  }

  async getStats(): Promise<{
    newConverts: number;
    pendingFollowups: number;
    completedTasks: number;
    activeMembers: number;
    baptized: number;
    inBibleStudy: number;
    inSmallGroup: number;
  }> {
    const [
      newConvertsResult,
      pendingFollowupsResult,
      completedTasksResult,
      activeMembersResult,
      baptizedResult,
      inBibleStudyResult,
      inSmallGroupResult
    ] = await Promise.all([
      db.select({ count: count() }).from(members),
      db.select({ count: count() }).from(tasks).where(eq(tasks.status, "pending")),
      db.select({ count: count() }).from(tasks).where(eq(tasks.status, "completed")),
      db.select({ count: count() }).from(members).where(eq(members.status, "active")),
      db.select({ count: count() }).from(members).where(eq(members.baptized, true)),
      db.select({ count: count() }).from(members).where(eq(members.inBibleStudy, true)),
      db.select({ count: count() }).from(members).where(eq(members.inSmallGroup, true))
    ]);

    return {
      newConverts: newConvertsResult[0]?.count || 0,
      pendingFollowups: pendingFollowupsResult[0]?.count || 0,
      completedTasks: completedTasksResult[0]?.count || 0,
      activeMembers: activeMembersResult[0]?.count || 0,
      baptized: baptizedResult[0]?.count || 0,
      inBibleStudy: inBibleStudyResult[0]?.count || 0,
      inSmallGroup: inSmallGroupResult[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();