import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Vérifier que toutes les variables sont définies (seulement en runtime, pas à l'import)
// On ne peut pas throw ici car cela empêcherait le module de se charger
// On vérifiera dans les fonctions qui utilisent Firebase
function validateFirebaseConfig() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Firebase configuration is missing. Please check your environment variables.');
    console.error('Missing:', {
      apiKey: !firebaseConfig.apiKey,
      projectId: !firebaseConfig.projectId,
      authDomain: !firebaseConfig.authDomain,
      storageBucket: !firebaseConfig.storageBucket,
      messagingSenderId: !firebaseConfig.messagingSenderId,
      appId: !firebaseConfig.appId,
    });
    throw new Error('Firebase configuration is incomplete. Missing required environment variables.');
  }
}

// Initialiser Firebase (éviter les doubles initialisations)
let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

function initializeFirebase() {
  if (app && dbInstance) {
    return { app, db: dbInstance };
  }

  validateFirebaseConfig();

  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  } else {
    app = getApps()[0];
  }

  // Initialiser Firestore
  try {
    dbInstance = getFirestore(app);
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }

  return { app, db: dbInstance };
}

// Exporter une fonction qui initialise et retourne db
export function getDb(): Firestore {
  const startTime = Date.now();
  console.log('[Firebase] getDb() appelé');
  
  if (!dbInstance) {
    console.log('[Firebase] Initialisation nécessaire...');
    const { db } = initializeFirebase();
    console.log(`[Firebase] Initialisation terminée en ${Date.now() - startTime}ms`);
    return db;
  }
  console.log(`[Firebase] getDb() retourné (cached) en ${Date.now() - startTime}ms`);
  return dbInstance;
}

// Pour compatibilité (lazy initialization via getter)
let _db: Firestore | undefined;
export const db = (() => {
  if (!_db) {
    _db = getDb();
  }
  return _db;
})();

export default function getApp(): FirebaseApp {
  if (!app) {
    return initializeFirebase().app;
  }
  return app;
}
