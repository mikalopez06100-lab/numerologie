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

// Vérifier que toutes les variables sont définies
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase configuration is missing. Please check your environment variables.');
  throw new Error('Firebase configuration is incomplete. Missing required environment variables.');
}

// Initialiser Firebase (éviter les doubles initialisations)
let app: FirebaseApp;
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
let db: Firestore;
try {
  db = getFirestore(app);
} catch (error) {
  console.error('Error initializing Firestore:', error);
  throw error;
}

export { db };
export default app;
