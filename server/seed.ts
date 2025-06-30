import { db } from "./db";
import { members, tasks, followUps } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(followUps);
  await db.delete(tasks);
  await db.delete(members);

  // Sample members data
  const sampleMembers = [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Faith Street, City, ST 12345",
      convertedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      baptized: false,
      baptismDate: null,
      inBibleStudy: true,
      inSmallGroup: false,
      notes: "Very enthusiastic about faith. Baptism scheduled for next week.",
      assignedStaff: "Pastor Jide",
      status: "contacted",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 987-6543",
      address: "456 Hope Avenue, City, ST 12345",
      convertedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
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
      phone: "+1 (555) 456-7890",
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

  const insertedMembers = await db.insert(members).values(sampleMembers).returning();
  console.log(`✅ Inserted ${insertedMembers.length} members`);

  // Sample tasks data
  const sampleTasks = [
    {
      title: "Follow-up call with Michael Chen",
      description: "Discuss Bible study progress and address questions",
      memberId: insertedMembers[1].id, // Michael Chen
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
      memberId: insertedMembers[0].id, // Sarah Johnson
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
      memberId: insertedMembers[2].id, // Maria Rodriguez
      assignedTo: "Pastor Jide",
      priority: "low",
      status: "pending",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Friday
      completedDate: null,
      reminderSent: false
    }
  ];

  const insertedTasks = await db.insert(tasks).values(sampleTasks).returning();
  console.log(`✅ Inserted ${insertedTasks.length} tasks`);

  // Sample follow-ups data
  const sampleFollowUps = [
    {
      type: "phone_call",
      notes: "Initial welcome call completed. Answered questions about baptism process.",
      memberId: insertedMembers[0].id, // Sarah Johnson
      completedDate: null,
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      nextFollowUp: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },
    {
      type: "visit",
      notes: "Home visit to discuss joining small group",
      memberId: insertedMembers[1].id, // Michael Chen
      completedDate: null,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      nextFollowUp: null
    },
    {
      type: "email",
      notes: "Sent congratulations on baptism and small group resources",
      memberId: insertedMembers[2].id, // Maria Rodriguez
      completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
  ];

  const insertedFollowUps = await db.insert(followUps).values(sampleFollowUps).returning();
  console.log(`✅ Inserted ${insertedFollowUps.length} follow-ups`);

  console.log("🎉 Database seeded successfully!");
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log("✅ Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export { seed };