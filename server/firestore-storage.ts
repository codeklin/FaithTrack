import { adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import {
  Member,
  Task,
  FollowUp,
  User,
  InsertMember,
  InsertTask,
  InsertFollowUp,
  InsertUser,
  UpdateMember,
  UpdateTask,
  UpdateFollowUp,
  memberSchema,
  taskSchema,
  followUpSchema,
  userSchema
} from '@shared/firestore-schema';

// Type for Firestore document snapshot
type FirestoreDoc = FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot;

// Collection names
const COLLECTIONS = {
  MEMBERS: 'members',
  TASKS: 'tasks',
  FOLLOW_UPS: 'followUps',
  USERS: 'users'
} as const;

// Helper function to convert Date to Firestore Timestamp
const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Helper function to convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp && timestamp._seconds) {
    return new Date(timestamp._seconds * 1000);
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
};

// Helper function to convert Firestore document to typed object
const convertFirestoreDoc = <T>(doc: FirestoreDoc, schema: any): T => {
  const data = doc.data();
  if (!data) {
    throw new Error('Document data is undefined');
  }
  
  const converted = {
    id: doc.id,
    ...data,
    // Convert Firestore Timestamps to Dates
    ...(data.createdAt && { createdAt: timestampToDate(data.createdAt) }),
    ...(data.updatedAt && { updatedAt: timestampToDate(data.updatedAt) }),
    ...(data.convertedDate && { convertedDate: timestampToDate(data.convertedDate) }),
    ...(data.baptismDate && { baptismDate: timestampToDate(data.baptismDate) }),
    ...(data.dueDate && { dueDate: timestampToDate(data.dueDate) }),
    ...(data.completedDate && { completedDate: timestampToDate(data.completedDate) }),
    ...(data.scheduledDate && { scheduledDate: timestampToDate(data.scheduledDate) }),
  };
  
  return schema.parse(converted);
};

// Helper function to prepare data for Firestore
const prepareForFirestore = (data: any) => {
  const prepared = { ...data };
  
  // Convert Dates to Firestore Timestamps
  Object.keys(prepared).forEach(key => {
    if (prepared[key] instanceof Date) {
      prepared[key] = dateToTimestamp(prepared[key]);
    }
  });
  
  // Add timestamps
  const now = dateToTimestamp(new Date());
  if (!prepared.createdAt) prepared.createdAt = now;
  prepared.updatedAt = now;
  
  return prepared;
};

export class FirestoreStorage {
  // Member operations
  async getMembers(): Promise<Member[]> {
    const membersRef = adminDb.collection(COLLECTIONS.MEMBERS);
    const snapshot = await membersRef.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => convertFirestoreDoc<Member>(doc, memberSchema));
  }

  async getMember(id: string): Promise<Member | null> {
    const memberRef = adminDb.collection(COLLECTIONS.MEMBERS).doc(id);
    const snapshot = await memberRef.get();
    
    if (!snapshot.exists) {
      return null;
    }
    
    return convertFirestoreDoc<Member>(snapshot, memberSchema);
  }

  async createMember(memberData: InsertMember): Promise<Member> {
    try {
      console.log('Creating member in Firestore with data:', memberData);

      const membersRef = adminDb.collection(COLLECTIONS.MEMBERS);
      const preparedData = prepareForFirestore(memberData);

      console.log('Prepared data for Firestore:', preparedData);

      const docRef = await membersRef.add(preparedData);
      console.log('Created document with ID:', docRef.id);

      const newMember = await this.getMember(docRef.id);
      if (!newMember) {
        throw new Error('Failed to retrieve created member');
      }

      console.log('Successfully created member:', newMember);
      return newMember;
    } catch (error) {
      console.error('Error in createMember:', error);
      throw new Error(`Failed to create member: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateMember(id: string, memberData: UpdateMember): Promise<Member> {
    const memberRef = adminDb.collection(COLLECTIONS.MEMBERS).doc(id);
    const preparedData = prepareForFirestore(memberData);
    await memberRef.update(preparedData);
    
    const updatedMember = await this.getMember(id);
    if (!updatedMember) {
      throw new Error('Failed to update member');
    }
    
    return updatedMember;
  }

  async deleteMember(id: string): Promise<void> {
    const memberRef = adminDb.collection(COLLECTIONS.MEMBERS).doc(id);
    await memberRef.delete();
  }

  async getRecentMembers(limitCount: number = 5): Promise<Member[]> {
    const membersRef = adminDb.collection(COLLECTIONS.MEMBERS);
    const snapshot = await membersRef.orderBy('createdAt', 'desc').limit(limitCount).get();
    return snapshot.docs.map(doc => convertFirestoreDoc<Member>(doc, memberSchema));
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    const tasksRef = adminDb.collection(COLLECTIONS.TASKS);
    const snapshot = await tasksRef.orderBy('dueDate', 'asc').get();
    return snapshot.docs.map(doc => convertFirestoreDoc<Task>(doc, taskSchema));
  }

  async getTask(id: string): Promise<Task | null> {
    const taskRef = adminDb.collection(COLLECTIONS.TASKS).doc(id);
    const snapshot = await taskRef.get();
    
    if (!snapshot.exists) {
      return null;
    }
    
    return convertFirestoreDoc<Task>(snapshot, taskSchema);
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const tasksRef = adminDb.collection(COLLECTIONS.TASKS);
    const preparedData = prepareForFirestore(taskData);
    const docRef = await tasksRef.add(preparedData);
    
    const newTask = await this.getTask(docRef.id);
    if (!newTask) {
      throw new Error('Failed to create task');
    }
    
    return newTask;
  }

  async updateTask(id: string, taskData: UpdateTask): Promise<Task> {
    const taskRef = adminDb.collection(COLLECTIONS.TASKS).doc(id);
    const preparedData = prepareForFirestore(taskData);
    await taskRef.update(preparedData);
    
    const updatedTask = await this.getTask(id);
    if (!updatedTask) {
      throw new Error('Failed to update task');
    }
    
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const taskRef = adminDb.collection(COLLECTIONS.TASKS).doc(id);
    await taskRef.delete();
  }

  async completeTask(id: string): Promise<Task> {
    return this.updateTask(id, { 
      status: 'completed',
      completedDate: new Date()
    });
  }

  async getTasksByMember(memberId: string): Promise<Task[]> {
    const tasksRef = adminDb.collection(COLLECTIONS.TASKS);
    const snapshot = await tasksRef.where('memberId', '==', memberId).orderBy('dueDate', 'asc').get();
    return snapshot.docs.map(doc => convertFirestoreDoc<Task>(doc, taskSchema));
  }

  async getPendingTasks(): Promise<Task[]> {
    const tasksRef = adminDb.collection(COLLECTIONS.TASKS);
    const snapshot = await tasksRef.where('status', '==', 'pending').orderBy('dueDate', 'asc').get();
    return snapshot.docs.map(doc => convertFirestoreDoc<Task>(doc, taskSchema));
  }

  // FollowUp operations
  async getFollowUps(): Promise<FollowUp[]> {
    const followUpsRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS);
    const snapshot = await followUpsRef.orderBy('scheduledDate', 'asc').get();
    return snapshot.docs.map(doc => convertFirestoreDoc<FollowUp>(doc, followUpSchema));
  }

  async getFollowUp(id: string): Promise<FollowUp | null> {
    const followUpRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS).doc(id);
    const snapshot = await followUpRef.get();
    
    if (!snapshot.exists) {
      return null;
    }
    
    return convertFirestoreDoc<FollowUp>(snapshot, followUpSchema);
  }

  async createFollowUp(followUpData: InsertFollowUp): Promise<FollowUp> {
    const followUpsRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS);
    const preparedData = prepareForFirestore(followUpData);
    const docRef = await followUpsRef.add(preparedData);
    
    const newFollowUp = await this.getFollowUp(docRef.id);
    if (!newFollowUp) {
      throw new Error('Failed to create follow-up');
    }
    
    return newFollowUp;
  }

  async updateFollowUp(id: string, followUpData: UpdateFollowUp): Promise<FollowUp> {
    const followUpRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS).doc(id);
    const preparedData = prepareForFirestore(followUpData);
    await followUpRef.update(preparedData);
    
    const updatedFollowUp = await this.getFollowUp(id);
    if (!updatedFollowUp) {
      throw new Error('Failed to update follow-up');
    }
    
    return updatedFollowUp;
  }

  async deleteFollowUp(id: string): Promise<void> {
    const followUpRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS).doc(id);
    await followUpRef.delete();
  }

  async completeFollowUp(id: string): Promise<FollowUp> {
    return this.updateFollowUp(id, { 
      completedDate: new Date()
    });
  }

  async getFollowUpsByMember(memberId: string): Promise<FollowUp[]> {
    const followUpsRef = adminDb.collection(COLLECTIONS.FOLLOW_UPS);
    const snapshot = await followUpsRef.where('memberId', '==', memberId).orderBy('scheduledDate', 'asc').get();
    return snapshot.docs.map(doc => convertFirestoreDoc<FollowUp>(doc, followUpSchema));
  }

  // User operations
  async getUser(id: string): Promise<User | null> {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(id);
    const snapshot = await userRef.get();
    
    if (!snapshot.exists) {
      return null;
    }
    
    return convertFirestoreDoc<User>(snapshot, userSchema);
  }

  async createUser(userData: InsertUser & { id: string }): Promise<User> {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(userData.id);
    const preparedData = prepareForFirestore(userData);
    await userRef.set(preparedData);
    
    const newUser = await this.getUser(userData.id);
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    
    return newUser;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(id);
    const preparedData = prepareForFirestore(userData);
    await userRef.update(preparedData);
    
    const updatedUser = await this.getUser(id);
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    
    return updatedUser;
  }
}

export const firestoreStorage = new FirestoreStorage();
