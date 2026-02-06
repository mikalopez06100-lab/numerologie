import { getAdminDb } from './admin';
import * as admin from 'firebase-admin';

// Types pour correspondre au schéma Prisma
export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace?: string | null;
  createdAt: Date;
}

export interface Numerology {
  id: string;
  profileId: string;
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality?: number | null;
  createdAt: Date;
}

export interface Report {
  id: string;
  profileId: string;
  type: string; // ReportType
  contentJson: string; // JSON stocké comme string
  createdAt: Date;
}

export interface Unlock {
  id: string;
  profileId: string;
  moduleType: string; // ModuleType
  isUnlocked: boolean;
  unlockedAt?: Date | null;
}

export interface EventLog {
  id: string;
  profileId?: string | null;
  eventType: string;
  metadata?: string | null; // JSON stocké comme string
  createdAt: Date;
}

// Helper pour convertir Firestore Timestamp en Date
function toDate(timestamp: admin.firestore.Timestamp | Date | null | undefined): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp instanceof admin.firestore.Timestamp) {
    return timestamp.toDate();
  }
  return new Date();
}

// ============ PROFILES ============

export async function createProfile(data: {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace?: string | null;
}): Promise<Profile> {
  const startTime = Date.now();
  try {
    const db = getAdminDb();
    
    // Créer le document avec timeout
    const profileRef = db.collection('profiles').doc();
    const id = profileRef.id;
    
    // Utiliser batch write pour plus de fiabilité
    const batch = db.batch();
    batch.set(profileRef, {
      ...data,
      id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Timeout de 10 secondes pour l'écriture
    await Promise.race([
      batch.commit(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore write timeout')), 10000)
      )
    ]);

    console.log(`[Firestore] Profile créé en ${Date.now() - startTime}ms`);

    return {
      id,
      ...data,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error(`[Firestore] Error creating profile (${Date.now() - startTime}ms):`, error);
    throw error;
  }
}

export async function getProfile(id: string): Promise<Profile | null> {
  const db = getAdminDb();
  const docRef = db.collection('profiles').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  const data = docSnap.data();
  if (!data) return null;

  return {
    id: docSnap.id,
    firstName: data.firstName,
    lastName: data.lastName,
    birthDate: data.birthDate,
    birthPlace: data.birthPlace || null,
    createdAt: toDate(data.createdAt),
  };
}

// ============ NUMEROLOGY ============

export async function createNumerology(data: {
  profileId: string;
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality?: number | null;
}): Promise<Numerology> {
  const db = getAdminDb();
  const numerologyRef = db.collection('numerologies').doc();
  const id = numerologyRef.id;
  
  // Timeout de 10 secondes
  await Promise.race([
    numerologyRef.set({
      ...data,
      id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore write timeout')), 10000)
    )
  ]);

  return {
    id,
    ...data,
    personality: data.personality || null,
    createdAt: new Date(),
  };
}

export async function getNumerologyByProfileId(profileId: string): Promise<Numerology | null> {
  const db = getAdminDb();
  const querySnapshot = await db.collection('numerologies')
    .where('profileId', '==', profileId)
    .limit(1)
    .get();

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();
  if (!data) return null;

  return {
    id: docSnap.id,
    profileId: data.profileId,
    lifePath: data.lifePath,
    expression: data.expression,
    soulUrge: data.soulUrge,
    personality: data.personality || null,
    createdAt: toDate(data.createdAt),
  };
}

// ============ REPORTS ============

export async function createReport(data: {
  profileId: string;
  type: string;
  contentJson: string;
}): Promise<Report> {
  const db = getAdminDb();
  const reportRef = db.collection('reports').doc();
  const id = reportRef.id;
  const reportData = {
    ...data,
    id,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await reportRef.set(reportData);

  return {
    id,
    ...data,
    createdAt: new Date(),
  };
}

export async function getReportsByProfileId(profileId: string): Promise<Report[]> {
  const db = getAdminDb();
  const querySnapshot = await db.collection('reports')
    .where('profileId', '==', profileId)
    .orderBy('createdAt', 'desc')
    .get();

  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      profileId: data.profileId,
      type: data.type,
      contentJson: data.contentJson,
      createdAt: toDate(data.createdAt),
    };
  });
}

// ============ UNLOCKS ============

export async function getUnlockByProfileAndModule(
  profileId: string,
  moduleType: string
): Promise<Unlock | null> {
  const db = getAdminDb();
  const querySnapshot = await db.collection('unlocks')
    .where('profileId', '==', profileId)
    .where('moduleType', '==', moduleType)
    .limit(1)
    .get();

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();
  if (!data) return null;

  return {
    id: docSnap.id,
    profileId: data.profileId,
    moduleType: data.moduleType,
    isUnlocked: data.isUnlocked || false,
    unlockedAt: data.unlockedAt ? toDate(data.unlockedAt) : null,
  };
}

export async function createOrUpdateUnlock(data: {
  profileId: string;
  moduleType: string;
  isUnlocked: boolean;
  unlockedAt?: Date | null;
}): Promise<Unlock> {
  const db = getAdminDb();
  const existing = await getUnlockByProfileAndModule(data.profileId, data.moduleType);

  if (existing) {
    // Mettre à jour
    const updateData: any = {
      isUnlocked: data.isUnlocked,
    };
    if (data.unlockedAt) {
      updateData.unlockedAt = admin.firestore.Timestamp.fromDate(data.unlockedAt);
    } else {
      updateData.unlockedAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('unlocks').doc(existing.id).update(updateData);

    return {
      ...existing,
      ...data,
      unlockedAt: data.unlockedAt || new Date(),
    };
  } else {
    // Créer
    const unlockRef = db.collection('unlocks').doc();
    const id = unlockRef.id;
    const unlockData = {
      profileId: data.profileId,
      moduleType: data.moduleType,
      isUnlocked: data.isUnlocked,
      unlockedAt: data.unlockedAt 
        ? admin.firestore.Timestamp.fromDate(data.unlockedAt) 
        : admin.firestore.FieldValue.serverTimestamp(),
    };

    await unlockRef.set(unlockData);

    return {
      id,
      ...data,
      unlockedAt: data.unlockedAt || new Date(),
    };
  }
}

export async function getUnlocksByProfileId(profileId: string): Promise<Unlock[]> {
  const db = getAdminDb();
  const querySnapshot = await db.collection('unlocks')
    .where('profileId', '==', profileId)
    .get();

  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      profileId: data.profileId,
      moduleType: data.moduleType,
      isUnlocked: data.isUnlocked || false,
      unlockedAt: data.unlockedAt ? toDate(data.unlockedAt) : null,
    };
  });
}

// ============ EVENT LOGS ============

export async function createEventLog(data: {
  eventType: string;
  metadata?: string | null;
  profileId?: string | null;
}): Promise<EventLog> {
  const db = getAdminDb();
  const eventRef = db.collection('event_logs').doc();
  const id = eventRef.id;
  const eventData = {
    eventType: data.eventType,
    metadata: data.metadata || null,
    profileId: data.profileId || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await eventRef.set(eventData);

  return {
    id,
    ...data,
    createdAt: new Date(),
  };
}

export async function getEventLogsByType(eventType: string): Promise<EventLog[]> {
  const db = getAdminDb();
  const querySnapshot = await db.collection('event_logs')
    .where('eventType', '==', eventType)
    .get();

  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      eventType: data.eventType,
      metadata: data.metadata || null,
      profileId: data.profileId || null,
      createdAt: toDate(data.createdAt),
    };
  });
}
