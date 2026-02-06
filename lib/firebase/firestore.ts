import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { getDb } from './config';

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
function toDate(timestamp: Timestamp | Date | null | undefined): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
}

// Helper pour convertir Date en Firestore Timestamp
function toTimestamp(date: Date | null | undefined): Timestamp | null {
  if (!date) return null;
  return Timestamp.fromDate(date instanceof Date ? date : new Date(date));
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
    console.log('[Firestore] Initialisation de getDb()...');
    const db = getDb();
    console.log('[Firestore] getDb() OK, création du document...');
    
    const profileRef = doc(collection(db, 'profiles'));
    const id = profileRef.id;
    const profileData = {
      ...data,
      id,
      createdAt: serverTimestamp(),
    };

    console.log('[Firestore] setDoc en cours...');
    await setDoc(profileRef, profileData);
    console.log(`[Firestore] Profile créé en ${Date.now() - startTime}ms`);

    return {
      id,
      ...data,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error(`[Firestore] Error creating profile (${Date.now() - startTime}ms):`, error);
    throw new Error(`Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getProfile(id: string): Promise<Profile | null> {
  const db = getDb();
  const docRef = doc(db, 'profiles', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
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
  const db = getDb();
  const numerologyRef = doc(collection(db, 'numerologies'));
  const id = numerologyRef.id;
  const numerologyData = {
    ...data,
    id,
    createdAt: serverTimestamp(),
  };

  await setDoc(numerologyRef, numerologyData);

  return {
    id,
    ...data,
    personality: data.personality || null,
    createdAt: new Date(),
  };
}

export async function getNumerologyByProfileId(profileId: string): Promise<Numerology | null> {
  const db = getDb();
  const q = query(
    collection(db, 'numerologies'),
    where('profileId', '==', profileId)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();
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
  const db = getDb();
  const reportRef = doc(collection(db, 'reports'));
  const id = reportRef.id;
  const reportData = {
    ...data,
    id,
    createdAt: serverTimestamp(),
  };

  await setDoc(reportRef, reportData);

  return {
    id,
    ...data,
    createdAt: new Date(),
  };
}

export async function getReportsByProfileId(profileId: string): Promise<Report[]> {
  const db = getDb();
  const q = query(
    collection(db, 'reports'),
    where('profileId', '==', profileId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);

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
  const db = getDb();
  const q = query(
    collection(db, 'unlocks'),
    where('profileId', '==', profileId),
    where('moduleType', '==', moduleType)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();
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
  const db = getDb();
  const existing = await getUnlockByProfileAndModule(data.profileId, data.moduleType);

  if (existing) {
    // Mettre à jour
    const updateData: any = {
      isUnlocked: data.isUnlocked,
    };
    if (data.unlockedAt) {
      updateData.unlockedAt = toTimestamp(data.unlockedAt);
    } else {
      updateData.unlockedAt = serverTimestamp();
    }

    await updateDoc(doc(db, 'unlocks', existing.id), updateData);

    return {
      ...existing,
      ...data,
      unlockedAt: data.unlockedAt || new Date(),
    };
  } else {
    // Créer
    const unlockRef = doc(collection(db, 'unlocks'));
    const id = unlockRef.id;
    const unlockData = {
      profileId: data.profileId,
      moduleType: data.moduleType,
      isUnlocked: data.isUnlocked,
      unlockedAt: data.unlockedAt ? toTimestamp(data.unlockedAt) : serverTimestamp(),
    };

    await setDoc(unlockRef, unlockData);

    return {
      id,
      ...data,
      unlockedAt: data.unlockedAt || new Date(),
    };
  }
}

export async function getUnlocksByProfileId(profileId: string): Promise<Unlock[]> {
  const db = getDb();
  const q = query(
    collection(db, 'unlocks'),
    where('profileId', '==', profileId)
  );
  const querySnapshot = await getDocs(q);

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
  const db = getDb();
  const eventRef = doc(collection(db, 'event_logs'));
  const id = eventRef.id;
  const eventData = {
    eventType: data.eventType,
    metadata: data.metadata || null,
    profileId: data.profileId || null,
    createdAt: serverTimestamp(),
  };

  await setDoc(eventRef, eventData);

  return {
    id,
    ...data,
    createdAt: new Date(),
  };
}

export async function getEventLogsByType(eventType: string): Promise<EventLog[]> {
  const db = getDb();
  const q = query(
    collection(db, 'event_logs'),
    where('eventType', '==', eventType)
  );
  const querySnapshot = await getDocs(q);

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
