import { firestoreStorage } from "./firestore-storage";
import type { InsertMember, InsertTask, InsertFollowUp } from "@shared/firestore-schema";

async function seed() {
  console.log("🌱 Seeding Firestore database...");

  // Sample members data
  const sampleMembers: InsertMember[] = [
    {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0101",
      address: "123 Main St, Anytown, USA",
      dateOfBirth: new Date("1985-03-15"),
      membershipStatus: "active",
      joinDate: new Date("2020-01-15"),
      baptismDate: new Date("2020-06-15"),
      notes: "Active in youth ministry",
      status: "active",
      convertedDate: new Date("2020-01-15"),
      baptized: true,
      inBibleStudy: true,
      inSmallGroup: false,
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0102",
      address: "456 Oak Ave, Anytown, USA",
      dateOfBirth: new Date("1990-07-22"),
      membershipStatus: "active",
      joinDate: new Date("2019-09-10"),
      baptismDate: new Date("2019-12-25"),
      notes: "Choir member and volunteer coordinator",
      status: "active",
      convertedDate: new Date("2019-09-10"),
      baptized: true,
      inBibleStudy: false,
      inSmallGroup: true,
    },
    {
      name: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "+1-555-0103",
      address: "789 Pine St, Anytown, USA",
      dateOfBirth: new Date("1978-11-08"),
      membershipStatus: "active",
      joinDate: new Date("2018-05-20"),
      baptismDate: new Date("2018-08-15"),
      notes: "Deacon and community outreach leader",
      status: "active",
      convertedDate: new Date("2018-05-20"),
      baptized: true,
      inBibleStudy: true,
      inSmallGroup: true,
    },
    {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1-555-0104",
      address: "321 Elm St, Anytown, USA",
      dateOfBirth: new Date("1995-02-14"),
      membershipStatus: "active",
      joinDate: new Date("2021-03-01"),
      notes: "New member, interested in Bible study groups",
      status: "new",
      convertedDate: new Date("2021-03-01"),
      baptized: false,
      inBibleStudy: true,
      inSmallGroup: false,
    },
    {
      name: "Robert Wilson",
      email: "robert.wilson@email.com",
      phone: "+1-555-0105",
      address: "654 Maple Dr, Anytown, USA",
      dateOfBirth: new Date("1965-09-30"),
      membershipStatus: "inactive",
      joinDate: new Date("2015-11-12"),
      baptismDate: new Date("2016-04-10"),
      notes: "Moved to another city, maintaining membership",
      status: "active",
      convertedDate: new Date("2015-11-12"),
      baptized: true,
      inBibleStudy: false,
      inSmallGroup: false,
    },
  ];

  console.log("Creating members...");
  const insertedMembers = [];
  for (const memberData of sampleMembers) {
    const member = await firestoreStorage.createMember(memberData);
    insertedMembers.push(member);
    console.log(`Created member: ${member.name}`);
  }

  // Sample tasks data
  const sampleTasks: InsertTask[] = [
    {
      title: "Follow up with new member Emily",
      description: "Schedule a welcome meeting and introduce to Bible study group",
      memberId: insertedMembers[3].id!, // Emily Davis
      assignedTo: "Pastor Johnson",
      priority: "high",
      status: "pending",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    },
    {
      title: "Baptism preparation for John",
      description: "Complete baptism classes and schedule ceremony",
      memberId: insertedMembers[0].id!, // John Smith
      assignedTo: "Pastor Johnson",
      priority: "medium",
      status: "completed",
      dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago

    },
    {
      title: "Visit Robert Wilson",
      description: "Check in on Robert and his family after their move",
      memberId: insertedMembers[4].id!, // Robert Wilson
      assignedTo: "Deacon Michael",
      priority: "medium",
      status: "pending",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    },
    {
      title: "Organize youth ministry event",
      description: "Plan and coordinate monthly youth gathering",
      assignedTo: "Sarah Johnson",
      priority: "high",
      status: "pending",
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    },
    {
      title: "Community outreach planning",
      description: "Develop strategy for next quarter's community service projects",
      memberId: insertedMembers[2].id!, // Michael Brown
      assignedTo: "Michael Brown",
      priority: "medium",
      status: "pending",
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    },
  ];

  console.log("Creating tasks...");
  const insertedTasks = [];
  for (const taskData of sampleTasks) {
    const task = await firestoreStorage.createTask(taskData);
    insertedTasks.push(task);
    console.log(`Created task: ${task.title}`);
  }

  // Sample follow-ups data
  const sampleFollowUps: InsertFollowUp[] = [
    {
      memberId: insertedMembers[3].id!, // Emily Davis
      type: "call",
      notes: "Welcome call to new member",
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
    {
      memberId: insertedMembers[0].id!, // John Smith
      type: "visit",
      notes: "Home visit to discuss ministry involvement",
      scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    },
    {
      memberId: insertedMembers[4].id!, // Robert Wilson
      type: "email",
      notes: "Check in via email about family's adjustment to new city",
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    },
    {
      memberId: insertedMembers[1].id!, // Sarah Johnson
      type: "call",
      notes: "Discuss choir schedule and upcoming performances",
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },
    {
      memberId: insertedMembers[2].id!, // Michael Brown
      type: "visit",
      notes: "Meeting to plan community outreach initiatives",
      scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    },
  ];

  console.log("Creating follow-ups...");
  const insertedFollowUps = [];
  for (const followUpData of sampleFollowUps) {
    const followUp = await firestoreStorage.createFollowUp(followUpData);
    insertedFollowUps.push(followUp);
    console.log(`Created follow-up: ${followUp.type} for member ${followUp.memberId}`);
  }

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${insertedMembers.length} members`);
  console.log(`Created ${insertedTasks.length} tasks`);
  console.log(`Created ${insertedFollowUps.length} follow-ups`);
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
