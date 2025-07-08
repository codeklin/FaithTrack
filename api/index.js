// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/firebase-admin.ts
import admin from "firebase-admin";
if (!admin.apps.length) {
  let serviceAccount = void 0;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && process.env.FIREBASE_SERVICE_ACCOUNT_KEY !== "your_service_account_json_here" && process.env.FIREBASE_SERVICE_ACCOUNT_KEY.startsWith("{")) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
    }
  }
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } else {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "demo-churchcare"
    });
  }
}
var adminAuth = admin.auth();
var adminDb = admin.firestore();

// server/firestore-storage.ts
import { Timestamp as Timestamp2 } from "firebase-admin/firestore";

// shared/firestore-schema.ts
import { z } from "zod";
import { Timestamp } from "firebase/firestore";
var memberSchema = z.object({
  id: z.string().optional(),
  // Firestore document ID
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  membershipStatus: z.enum(["active", "inactive", "pending"]).default("active"),
  joinDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  convertedDate: z.union([z.date(), z.instanceof(Timestamp)]).default(() => /* @__PURE__ */ new Date()),
  baptized: z.boolean().default(false),
  baptismDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  inBibleStudy: z.boolean().default(false),
  inSmallGroup: z.boolean().default(false),
  notes: z.string().optional(),
  assignedStaff: z.string().optional(),
  status: z.enum(["new", "contacted", "baptized", "active"]).default("new"),
  avatar: z.string().optional(),
  createdAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => /* @__PURE__ */ new Date()),
  updatedAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => /* @__PURE__ */ new Date())
});
var taskSchema = z.object({
  id: z.string().optional(),
  // Firestore document ID
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  memberId: z.string().optional(),
  // Reference to member document ID
  assignedTo: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  status: z.enum(["pending", "completed", "overdue"]).default("pending"),
  dueDate: z.union([z.date(), z.instanceof(Timestamp)]),
  completedDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  reminderSent: z.boolean().default(false),
  createdAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => /* @__PURE__ */ new Date()),
  updatedAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => /* @__PURE__ */ new Date())
});
var followUpSchema = z.object({
  id: z.string().optional(),
  // Firestore document ID
  memberId: z.string().min(1, "Member ID is required"),
  // Reference to member document ID
  type: z.enum(["call", "visit", "email", "text"]),
  notes: z.string().optional(),
  scheduledDate: z.union([z.date(), z.instanceof(Timestamp)]),
  completedDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  nextFollowUp: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  createdAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => /* @__PURE__ */ new Date()),
  updatedAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => /* @__PURE__ */ new Date())
});
var userSchema = z.object({
  id: z.string().optional(),
  // Firestore document ID (will be Firebase Auth UID)
  email: z.string().email(),
  displayName: z.string().optional(),
  role: z.enum(["admin", "staff", "volunteer"]).default("staff"),
  createdAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => /* @__PURE__ */ new Date()),
  updatedAt: z.union([z.date(), z.instanceof(Timestamp)]).default(() => /* @__PURE__ */ new Date())
});
var insertMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  membershipStatus: z.enum(["active", "inactive", "pending"]).optional().default("active"),
  joinDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  convertedDate: z.union([z.date(), z.instanceof(Timestamp)]).optional().default(() => /* @__PURE__ */ new Date()),
  baptized: z.boolean().optional().default(false),
  baptismDate: z.union([z.date(), z.instanceof(Timestamp)]).optional(),
  inBibleStudy: z.boolean().optional().default(false),
  inSmallGroup: z.boolean().optional().default(false),
  notes: z.string().optional(),
  assignedStaff: z.string().optional(),
  status: z.enum(["new", "contacted", "baptized", "active"]).optional().default("new"),
  avatar: z.string().optional()
});
var insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  memberId: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).optional().default("medium"),
  status: z.enum(["pending", "completed", "overdue"]).optional().default("pending"),
  dueDate: z.union([z.date(), z.instanceof(Timestamp)])
});
var insertFollowUpSchema = followUpSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedDate: true
});
var insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateTaskSchema = taskSchema.partial().omit({
  id: true,
  createdAt: true
});
var updateFollowUpSchema = followUpSchema.partial().omit({
  id: true,
  createdAt: true
});
var updateMemberSchema = memberSchema.partial().omit({
  id: true,
  createdAt: true
});

// server/firestore-storage.ts
var COLLECTIONS = {
  MEMBERS: "members",
  TASKS: "tasks",
  FOLLOW_UPS: "followUps",
  USERS: "users"
};
var dateToTimestamp = (date) => {
  return Timestamp2.fromDate(date);
};
var timestampToDate = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }
  if (timestamp && timestamp._seconds) {
    return new Date(timestamp._seconds * 1e3);
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
};
var convertFirestoreDoc = (doc, schema) => {
  const data = doc.data();
  if (!data) {
    throw new Error("Document data is undefined");
  }
  const converted = {
    id: doc.id,
    ...data,
    // Convert Firestore Timestamps to Dates
    ...data.createdAt && { createdAt: timestampToDate(data.createdAt) },
    ...data.updatedAt && { updatedAt: timestampToDate(data.updatedAt) },
    ...data.convertedDate && { convertedDate: timestampToDate(data.convertedDate) },
    ...data.baptismDate && { baptismDate: timestampToDate(data.baptismDate) },
    ...data.dueDate && { dueDate: timestampToDate(data.dueDate) },
    ...data.completedDate && { completedDate: timestampToDate(data.completedDate) },
    ...data.scheduledDate && { scheduledDate: timestampToDate(data.scheduledDate) }
  };
  return schema.parse(converted);
};
var prepareForFirestore = (data) => {
  const prepared = { ...data };
  Object.keys(prepared).forEach((key) => {
    if (prepared[key] instanceof Date) {
      prepared[key] = dateToTimestamp(prepared[key]);
    }
  });
  const now = dateToTimestamp(/* @__PURE__ */ new Date());
  if (!prepared.createdAt) prepared.createdAt = now;
  prepared.updatedAt = now;
  return prepared;
};
var FirestoreStorage = class {
  // Member operations
  async getMembers() {
    const membersRef = adminDb.collection(COLLECTIONS.MEMBERS);
    const snapshot = await membersRef.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => convertFirestoreDoc(doc, memberSchema));
  }
  async getMember(id) {
    const memberRef = adminDb.collection(COLLECTIONS.MEMBERS).doc(id);
    const snapshot = await memberRef.get();
    if (!snapshot.exists) {
      return null;
    }
    return convertFirestoreDoc(snapshot, memberSchema);
  }
  async createMember(memberData) {
    try {
      console.log("Creating member in Firestore with data:", memberData);
      const membersRef = adminDb.collection(COLLECTIONS.MEMBERS);
      const preparedData = prepareForFirestore(memberData);
      console.log("Prepared data for Firestore:", preparedData);
      const docRef = await membersRef.add(preparedData);
      console.log("Created document with ID:", docRef.id);
      const newMember = await this.getMember(docRef.id);
      if (!newMember) {
        throw new Error("Failed to retrieve created member");
      }
      console.log("Successfully created member:", newMember);
      return newMember;
    } catch (error) {
      console.error("Error in createMember:", error);
      throw new Error(`Failed to create member: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  async updateMember(id, memberData) {
    const memberRef = adminDb.collection(COLLECTIONS.MEMBERS).doc(id);
    const preparedData = prepareForFirestore(memberData);
    await memberRef.update(preparedData);
    const updatedMember = await this.getMember(id);
    if (!updatedMember) {
      throw new Error("Failed to update member");
    }
    return updatedMember;
  }
  async deleteMember(id) {
    const memberRef = adminDb.collection(COLLECTIONS.MEMBERS).doc(id);
    await memberRef.delete();
  }
  async getRecentMembers(limitCount = 5) {
    const membersRef = adminDb.collection(COLLECTIONS.MEMBERS);
    const snapshot = await membersRef.orderBy("createdAt", "desc").limit(limitCount).get();
    return snapshot.docs.map((doc) => convertFirestoreDoc(doc, memberSchema));
  }
  // Task operations
  async getTasks() {
    const tasksRef = adminDb.collection(COLLECTIONS.TASKS);
    const snapshot = await tasksRef.orderBy("dueDate", "asc").get();
    return snapshot.docs.map((doc) => convertFirestoreDoc(doc, taskSchema));
  }
  async getTask(id) {
    const taskRef = adminDb.collection(COLLECTIONS.TASKS).doc(id);
    const snapshot = await taskRef.get();
    if (!snapshot.exists) {
      return null;
    }
    return convertFirestoreDoc(snapshot, taskSchema);
  }
  async createTask(taskData) {
    const tasksRef = adminDb.collection(COLLECTIONS.TASKS);
    const preparedData = prepareForFirestore(taskData);
    const docRef = await tasksRef.add(preparedData);
    const newTask = await this.getTask(docRef.id);
    if (!newTask) {
      throw new Error("Failed to create task");
    }
    return newTask;
  }
  async updateTask(id, taskData) {
    const taskRef = adminDb.collection(COLLECTIONS.TASKS).doc(id);
    const preparedData = prepareForFirestore(taskData);
    await taskRef.update(preparedData);
    const updatedTask = await this.getTask(id);
    if (!updatedTask) {
      throw new Error("Failed to update task");
    }
    return updatedTask;
  }
  async deleteTask(id) {
    const taskRef = adminDb.collection(COLLECTIONS.TASKS).doc(id);
    await taskRef.delete();
  }
  async completeTask(id) {
    return this.updateTask(id, {
      status: "completed",
      completedDate: /* @__PURE__ */ new Date()
    });
  }
  async getTasksByMember(memberId) {
    const tasksRef = adminDb.collection(COLLECTIONS.TASKS);
    const snapshot = await tasksRef.where("memberId", "==", memberId).orderBy("dueDate", "asc").get();
    return snapshot.docs.map((doc) => convertFirestoreDoc(doc, taskSchema));
  }
  async getPendingTasks() {
    const tasksRef = adminDb.collection(COLLECTIONS.TASKS);
    const snapshot = await tasksRef.where("status", "==", "pending").orderBy("dueDate", "asc").get();
    return snapshot.docs.map((doc) => convertFirestoreDoc(doc, taskSchema));
  }
  // FollowUp operations
  async getFollowUps() {
    const followUpsRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS);
    const snapshot = await followUpsRef.orderBy("scheduledDate", "asc").get();
    return snapshot.docs.map((doc) => convertFirestoreDoc(doc, followUpSchema));
  }
  async getFollowUp(id) {
    const followUpRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS).doc(id);
    const snapshot = await followUpRef.get();
    if (!snapshot.exists) {
      return null;
    }
    return convertFirestoreDoc(snapshot, followUpSchema);
  }
  async createFollowUp(followUpData) {
    const followUpsRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS);
    const preparedData = prepareForFirestore(followUpData);
    const docRef = await followUpsRef.add(preparedData);
    const newFollowUp = await this.getFollowUp(docRef.id);
    if (!newFollowUp) {
      throw new Error("Failed to create follow-up");
    }
    return newFollowUp;
  }
  async updateFollowUp(id, followUpData) {
    const followUpRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS).doc(id);
    const preparedData = prepareForFirestore(followUpData);
    await followUpRef.update(preparedData);
    const updatedFollowUp = await this.getFollowUp(id);
    if (!updatedFollowUp) {
      throw new Error("Failed to update follow-up");
    }
    return updatedFollowUp;
  }
  async deleteFollowUp(id) {
    const followUpRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS).doc(id);
    await followUpRef.delete();
  }
  async completeFollowUp(id) {
    return this.updateFollowUp(id, {
      completedDate: /* @__PURE__ */ new Date()
    });
  }
  async getFollowUpsByMember(memberId) {
    const followUpsRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS);
    const snapshot = await followUpsRef.where("memberId", "==", memberId).orderBy("scheduledDate", "asc").get();
    return snapshot.docs.map((doc) => convertFirestoreDoc(doc, followUpSchema));
  }
  // User operations
  async getUser(id) {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(id);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      return null;
    }
    return convertFirestoreDoc(snapshot, userSchema);
  }
  async createUser(userData) {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(userData.id);
    const preparedData = prepareForFirestore(userData);
    await userRef.set(preparedData);
    const newUser = await this.getUser(userData.id);
    if (!newUser) {
      throw new Error("Failed to create user");
    }
    return newUser;
  }
  async updateUser(id, userData) {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(id);
    const preparedData = prepareForFirestore(userData);
    await userRef.update(preparedData);
    const updatedUser = await this.getUser(id);
    if (!updatedUser) {
      throw new Error("Failed to update user");
    }
    return updatedUser;
  }
};
var firestoreStorage = new FirestoreStorage();

// server/db.ts
if (process.env.NODE_ENV === "production") {
  const requiredEnvVars = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_SERVICE_ACCOUNT_KEY"
  ];
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingEnvVars.join(", ")}`
    );
  }
}
var storage = firestoreStorage;

// server/firebase-auth-middleware.ts
var authenticateFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userData = await firestoreStorage.getUser(decodedToken.uid);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      role: userData?.role || "staff"
    };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
var requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser({ ...userData, id: req.body.uid });
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.get("/api/auth/me", authenticateFirebaseToken, requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.uid);
      res.json(user || req.user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });
  app2.use("/api", authenticateFirebaseToken);
  app2.get("/api/members", requireAuth, async (req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });
  app2.get("/api/members/recent", requireAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const members = await storage.getRecentMembers(limit);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent members" });
    }
  });
  app2.get("/api/members/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const member = await storage.getMember(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member" });
    }
  });
  app2.post("/api/members", requireAuth, async (req, res) => {
    try {
      console.log("Creating member with data:", req.body);
      const memberData = insertMemberSchema.parse(req.body);
      console.log("Parsed member data:", memberData);
      const member = await storage.createMember(memberData);
      console.log("Created member:", member);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating member:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid member data",
          errors: error.errors,
          details: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`)
        });
      }
      res.status(500).json({
        message: "Failed to create member",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.put("/api/members/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const memberData = insertMemberSchema.partial().parse(req.body);
      const member = await storage.updateMember(id, memberData);
      res.json(member);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid member data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update member" });
    }
  });
  app2.delete("/api/members/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteMember(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete member" });
    }
  });
  app2.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });
  app2.get("/api/tasks/pending", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getPendingTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending tasks" });
    }
  });
  app2.get("/api/tasks/member/:memberId", requireAuth, async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const tasks = await storage.getTasksByMember(memberId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member tasks" });
    }
  });
  app2.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  app2.put("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, taskData);
      res.json(task);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  app2.post("/api/tasks/:id/complete", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const task = await storage.updateTask(id, {
        status: "completed",
        completedDate: /* @__PURE__ */ new Date()
      });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete task" });
    }
  });
  app2.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });
  app2.get("/api/followups", requireAuth, async (req, res) => {
    try {
      const followUps = await storage.getFollowUps();
      res.json(followUps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch follow-ups" });
    }
  });
  app2.get("/api/followups/member/:memberId", requireAuth, async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const followUps = await storage.getFollowUpsByMember(memberId);
      res.json(followUps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member follow-ups" });
    }
  });
  app2.post("/api/followups", requireAuth, async (req, res) => {
    try {
      const followUpData = insertFollowUpSchema.parse(req.body);
      const followUp = await storage.createFollowUp(followUpData);
      res.status(201).json(followUp);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid follow-up data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create follow-up" });
    }
  });
  app2.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const members = await storage.getMembers();
      const tasks = await storage.getTasks();
      const followUps = await storage.getFollowUps();
      const stats = {
        totalMembers: members.length,
        newConverts: members.filter((m) => m.status === "new").length,
        baptized: members.filter((m) => m.baptized).length,
        inBibleStudy: members.filter((m) => m.inBibleStudy).length,
        inSmallGroup: members.filter((m) => m.inSmallGroup).length,
        activeMembers: members.filter((m) => m.membershipStatus === "active").length,
        pendingTasks: tasks.filter((t) => t.status === "pending").length,
        completedTasks: tasks.filter((t) => t.status === "completed").length,
        pendingFollowups: followUps.filter((f) => !f.completedDate).length
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/analytics", requireAuth, async (req, res) => {
    try {
      const range = req.query.range || "30d";
      const members = await storage.getMembers();
      const tasks = await storage.getTasks();
      const followUps = await storage.getFollowUps();
      const now = /* @__PURE__ */ new Date();
      let startDate = /* @__PURE__ */ new Date();
      switch (range) {
        case "7d":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(now.getDate() - 90);
          break;
        case "1y":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }
      const recentMembers = members.filter(
        (m) => m.createdAt && new Date(m.createdAt) >= startDate
      );
      const recentTasks = tasks.filter(
        (t) => t.createdAt && new Date(t.createdAt) >= startDate
      );
      const analytics = {
        memberGrowth: recentMembers.length,
        taskCompletion: {
          completed: recentTasks.filter((t) => t.status === "completed").length,
          pending: recentTasks.filter((t) => t.status === "pending").length,
          overdue: recentTasks.filter((t) => t.status === "overdue").length
        },
        conversionFunnel: {
          newConverts: members.filter((m) => m.status === "new").length,
          contacted: members.filter((m) => m.status === "contacted").length,
          baptized: members.filter((m) => m.baptized).length,
          inBibleStudy: members.filter((m) => m.inBibleStudy).length,
          inSmallGroup: members.filter((m) => m.inSmallGroup).length
        },
        timeRange: range,
        startDate: startDate.toISOString(),
        endDate: now.toISOString()
      };
      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets")
    }
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  const fallbackDistPath = path2.resolve(process.cwd(), "dist", "public");
  const finalDistPath = fs.existsSync(distPath) ? distPath : fallbackDistPath;
  if (!fs.existsSync(finalDistPath)) {
    throw new Error(
      `Could not find the build directory: ${finalDistPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(finalDistPath, {
    maxAge: "1y",
    etag: true,
    lastModified: true,
    setHeaders: (res, path3) => {
      if (path3.endsWith(".webmanifest") || path3.endsWith("manifest.json")) {
        res.setHeader("Content-Type", "application/manifest+json");
      }
      if (path3.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      }
      if (path3.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader("Cache-Control", "public, max-age=31536000");
      } else {
        res.setHeader("Cache-Control", "public, max-age=0");
      }
    }
  }));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(finalDistPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((err, _req, res, _next) => {
  console.error("Express error:", err);
  res.status(500).json({ message: "Internal server error" });
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  console.log("Starting server...");
  const server = await registerRoutes(app);
  console.log("Routes registered successfully");
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  console.log("Environment check:", {
    'app.get("env")': app.get("env"),
    "process.env.NODE_ENV": process.env.NODE_ENV
  });
  if (app.get("env")?.trim() === "development" || process.env.NODE_ENV?.trim() === "development") {
    console.log("Setting up Vite for development");
    await setupVite(app, server);
  } else {
    console.log("Setting up static file serving for production");
    serveStatic(app);
  }
  const port = process.env.PORT || 5e3;
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
  server.listen({
    port: Number(port),
    host
  }, () => {
    log(`serving on port ${port} (${process.env.NODE_ENV || "development"})`);
  });
})().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
