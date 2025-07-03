import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./db";
import {
  insertMemberSchema,
  insertTaskSchema,
  insertFollowUpSchema,
  insertUserSchema,
  updateTaskSchema
} from "@shared/firestore-schema";
import { authenticateFirebaseToken, requireAuth } from "./firebase-auth-middleware";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes (no auth required)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser({ ...userData, id: req.body.uid });
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/auth/me", authenticateFirebaseToken, requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.uid);
      res.json(user || req.user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  // Apply Firebase authentication middleware to all other API routes
  app.use("/api", authenticateFirebaseToken);

  // Member routes
  app.get("/api/members", requireAuth, async (req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.get("/api/members/recent", requireAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const members = await storage.getRecentMembers(limit);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent members" });
    }
  });

  app.get("/api/members/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id; // Firestore uses string IDs
      const member = await storage.getMember(id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member" });
    }
  });

  app.post("/api/members", requireAuth, async (req, res) => {
    try {
      console.log('Creating member with data:', req.body);
      const memberData = insertMemberSchema.parse(req.body);
      console.log('Parsed member data:', memberData);

      const member = await storage.createMember(memberData);
      console.log('Created member:', member);

      res.status(201).json(member);
    } catch (error) {
      console.error('Error creating member:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid member data",
          errors: error.errors,
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
      }

      res.status(500).json({
        message: "Failed to create member",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.put("/api/members/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id; // Firestore uses string IDs
      const memberData = insertMemberSchema.partial().parse(req.body);
      const member = await storage.updateMember(id, memberData);
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid member data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update member" });
    }
  });

  app.delete("/api/members/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id; // Firestore uses string IDs
      await storage.deleteMember(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete member" });
    }
  });

  // Task routes
  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/pending", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getPendingTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending tasks" });
    }
  });

  app.get("/api/tasks/member/:memberId", requireAuth, async (req, res) => {
    try {
      const memberId = req.params.memberId; // Firestore uses string IDs
      const tasks = await storage.getTasksByMember(memberId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member tasks" });
    }
  });

  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id; // Firestore uses string IDs
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, taskData);
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.post("/api/tasks/:id/complete", requireAuth, async (req, res) => {
    try {
      const id = req.params.id; // Firestore uses string IDs
      const task = await storage.updateTask(id, {
        status: 'completed',
        completedDate: new Date()
      });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  app.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id; // Firestore uses string IDs
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Follow-up routes
  app.get("/api/followups", requireAuth, async (req, res) => {
    try {
      const followUps = await storage.getFollowUps();
      res.json(followUps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch follow-ups" });
    }
  });

  app.get("/api/followups/member/:memberId", requireAuth, async (req, res) => {
    try {
      const memberId = req.params.memberId; // Firestore uses string IDs
      const followUps = await storage.getFollowUpsByMember(memberId);
      res.json(followUps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member follow-ups" });
    }
  });

  app.post("/api/followups", requireAuth, async (req, res) => {
    try {
      const followUpData = insertFollowUpSchema.parse(req.body);
      const followUp = await storage.createFollowUp(followUpData);
      res.status(201).json(followUp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid follow-up data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create follow-up" });
    }
  });

  // Stats route
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      // For now, return basic stats - can be enhanced later
      const members = await storage.getMembers();
      const tasks = await storage.getTasks();
      const followUps = await storage.getFollowUps();

      const stats = {
        totalMembers: members.length,
        newConverts: members.filter(m => m.status === 'new').length,
        baptized: members.filter(m => m.baptized).length,
        inBibleStudy: members.filter(m => m.inBibleStudy).length,
        inSmallGroup: members.filter(m => m.inSmallGroup).length,
        activeMembers: members.filter(m => m.membershipStatus === 'active').length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        pendingFollowups: followUps.filter(f => !f.completedDate).length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Analytics route
  app.get("/api/analytics", requireAuth, async (req, res) => {
    try {
      const range = req.query.range as string || '30d';
      const members = await storage.getMembers();
      const tasks = await storage.getTasks();
      const followUps = await storage.getFollowUps();

      // Calculate date range
      const now = new Date();
      let startDate = new Date();

      switch (range) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Filter data by date range
      const recentMembers = members.filter(m =>
        m.createdAt && new Date(m.createdAt) >= startDate
      );
      const recentTasks = tasks.filter(t =>
        t.createdAt && new Date(t.createdAt) >= startDate
      );

      // Calculate growth metrics
      const analytics = {
        memberGrowth: recentMembers.length,
        taskCompletion: {
          completed: recentTasks.filter(t => t.status === 'completed').length,
          pending: recentTasks.filter(t => t.status === 'pending').length,
          overdue: recentTasks.filter(t => t.status === 'overdue').length,
        },
        conversionFunnel: {
          newConverts: members.filter(m => m.status === 'new').length,
          contacted: members.filter(m => m.status === 'contacted').length,
          baptized: members.filter(m => m.baptized).length,
          inBibleStudy: members.filter(m => m.inBibleStudy).length,
          inSmallGroup: members.filter(m => m.inSmallGroup).length,
        },
        timeRange: range,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      };

      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
