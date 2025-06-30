import { members, tasks, followUps, users, type Member, type InsertMember, type Task, type InsertTask, type FollowUp, type InsertFollowUp, type User, type InsertUser } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private members: Map<number, Member>;
  private tasks: Map<number, Task>;
  private followUps: Map<number, FollowUp>;
  private users: Map<number, User>;
  private currentMemberId: number;
  private currentTaskId: number;
  private currentFollowUpId: number;
  private currentUserId: number;

  constructor() {
    this.members = new Map();
    this.tasks = new Map();
    this.followUps = new Map();
    this.users = new Map();
    this.currentMemberId = 1;
    this.currentTaskId = 1;
    this.currentFollowUpId = 1;
    this.currentUserId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample members
    const sampleMembers: Array<Omit<Member, 'id'>> = [
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "(555) 123-4567",
        address: "123 Faith St, City, ST 12345",
        convertedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        baptized: false,
        baptismDate: null,
        inBibleStudy: true,
        inSmallGroup: false,
        notes: "Very enthusiastic about faith. Baptism scheduled for next week.",
        assignedStaff: "Pastor Jide",
        status: "contacted",
        avatar: "https://pixabay.com/get/g596c4e9d79430f2f0ac339ac424a1468679903994350d900f58333663b80021ccd2ee4eba2d36d1043a9006141f839b24d5ac282b6f01c2d73be074ec09a89ef_1280.jpg"
      },
      {
        name: "Michael Chen",
        email: "michael.chen@email.com",
        phone: "(555) 234-5678",
        address: "456 Hope Ave, City, ST 12345",
        convertedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        baptized: false,
        baptismDate: null,
        inBibleStudy: true,
        inSmallGroup: false,
        notes: "Has questions about Bible study material. Needs follow-up call.",
        assignedStaff: "Pastor Jide",
        status: "contacted",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
      },
      {
        name: "Maria Rodriguez",
        email: "maria.rodriguez@email.com",
        phone: "(555) 345-6789",
        address: "789 Grace Blvd, City, ST 12345",
        convertedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
        baptized: true,
        baptismDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        inBibleStudy: true,
        inSmallGroup: true,
        notes: "Active in small group. Great progress in spiritual journey.",
        assignedStaff: "Pastor Jide",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
      }
    ];

    sampleMembers.forEach((member) => {
      const id = this.currentMemberId++;
      this.members.set(id, { ...member, id });
    });

    // Add sample tasks
    const sampleTasks: Array<Omit<Task, 'id' | 'createdAt'>> = [
      {
        title: "Follow-up call with Michael Chen",
        description: "Discuss Bible study progress and address questions",
        memberId: 2,
        assignedTo: "Pastor Jide",
        priority: "high",
        status: "pending",
        dueDate: new Date(Date.now() + 1 * 60 * 60 * 1000), // Due in 1 hour
        completedDate: null,
        reminderSent: false
      },
      {
        title: "Schedule baptism for Sarah Johnson",
        description: "Coordinate with baptism team and family",
        memberId: 1,
        assignedTo: "Pastor Jide",
        priority: "medium",
        status: "pending",
        dueDate: new Date(Date.now() - 30 * 60 * 1000), // Overdue by 30 minutes
        completedDate: null,
        reminderSent: false
      },
      {
        title: "Send welcome package to Maria Rodriguez",
        description: "Include study materials and church information",
        memberId: 3,
        assignedTo: "Pastor Jide",
        priority: "low",
        status: "pending",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Friday
        completedDate: null,
        reminderSent: false
      }
    ];

    sampleTasks.forEach((task) => {
      const id = this.currentTaskId++;
      this.tasks.set(id, { ...task, id, createdAt: new Date() });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Member methods
  async getMembers(): Promise<Member[]> {
    return Array.from(this.members.values()).sort((a, b) => 
      new Date(b.convertedDate).getTime() - new Date(a.convertedDate).getTime()
    );
  }

  async getMember(id: number): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async createMember(member: InsertMember): Promise<Member> {
    const id = this.currentMemberId++;
    const newMember: Member = { 
      ...member, 
      id, 
      convertedDate: new Date(),
      baptized: false,
      baptismDate: null,
      inBibleStudy: false,
      inSmallGroup: false
    };
    this.members.set(id, newMember);
    return newMember;
  }

  async updateMember(id: number, memberUpdate: Partial<InsertMember>): Promise<Member | undefined> {
    const existing = this.members.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...memberUpdate };
    this.members.set(id, updated);
    return updated;
  }

  async deleteMember(id: number): Promise<boolean> {
    return this.members.delete(id);
  }

  async getRecentMembers(limit: number = 5): Promise<Member[]> {
    const allMembers = Array.from(this.members.values());
    return allMembers
      .sort((a, b) => new Date(b.convertedDate).getTime() - new Date(a.convertedDate).getTime())
      .slice(0, limit);
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const newTask: Task = { 
      ...task, 
      id, 
      createdAt: new Date(),
      completedDate: null,
      reminderSent: false
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...taskUpdate };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByMember(memberId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.memberId === memberId);
  }

  async getUrgentTasks(): Promise<Task[]> {
    const now = new Date();
    return Array.from(this.tasks.values())
      .filter(task => task.status === 'pending' && (task.dueDate <= now || task.priority === 'high'))
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      });
  }

  async getPendingTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.status === 'pending');
  }

  async completeTask(id: number): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updated = { ...task, status: 'completed' as const, completedDate: new Date() };
    this.tasks.set(id, updated);
    return updated;
  }

  // Follow-up methods
  async getFollowUps(): Promise<FollowUp[]> {
    return Array.from(this.followUps.values());
  }

  async getFollowUp(id: number): Promise<FollowUp | undefined> {
    return this.followUps.get(id);
  }

  async createFollowUp(followUp: InsertFollowUp): Promise<FollowUp> {
    const id = this.currentFollowUpId++;
    const newFollowUp: FollowUp = { 
      ...followUp, 
      id, 
      createdAt: new Date(),
      completedDate: null
    };
    this.followUps.set(id, newFollowUp);
    return newFollowUp;
  }

  async updateFollowUp(id: number, followUpUpdate: Partial<InsertFollowUp>): Promise<FollowUp | undefined> {
    const existing = this.followUps.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...followUpUpdate };
    this.followUps.set(id, updated);
    return updated;
  }

  async deleteFollowUp(id: number): Promise<boolean> {
    return this.followUps.delete(id);
  }

  async getFollowUpsByMember(memberId: number): Promise<FollowUp[]> {
    return Array.from(this.followUps.values()).filter(followUp => followUp.memberId === memberId);
  }

  async getUpcomingFollowUps(): Promise<FollowUp[]> {
    const now = new Date();
    return Array.from(this.followUps.values())
      .filter(followUp => !followUp.completedDate && followUp.scheduledDate >= now)
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  // Stats methods
  async getStats(): Promise<{
    newConverts: number;
    pendingFollowups: number;
    completedTasks: number;
    activeMembers: number;
    baptized: number;
    inBibleStudy: number;
    inSmallGroup: number;
  }> {
    const allMembers = Array.from(this.members.values());
    const allTasks = Array.from(this.tasks.values());
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      newConverts: allMembers.length,
      pendingFollowups: allTasks.filter(task => task.status === 'pending').length,
      completedTasks: allTasks.filter(task => task.status === 'completed' && task.completedDate && task.completedDate >= thirtyDaysAgo).length,
      activeMembers: allMembers.length,
      baptized: allMembers.filter(member => member.baptized).length,
      inBibleStudy: allMembers.filter(member => member.inBibleStudy).length,
      inSmallGroup: allMembers.filter(member => member.inSmallGroup).length
    };
  }
}

export const storage = new MemStorage();
