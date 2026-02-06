import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;
let db: admin.firestore.Firestore | null = null;

/**
 * Initialise Firebase Admin SDK de manière sécurisée
 */
function initializeAdmin(): void {
  if (app && db) {
    return;
  }

  const initStartTime = Date.now();
  console.log('[Firebase Admin] Initialisation...');

  // Vérifier que le service account est configuré
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  
  if (!serviceAccountJson) {
    console.error('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_JSON is not set');
    throw new Error('Firebase Admin not configured. Please set FIREBASE_SERVICE_ACCOUNT_JSON in Vercel.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    // Vérifier que l'app n'est pas déjà initialisée
    if (admin.apps.length === 0) {
      console.log('[Firebase Admin] Création de la nouvelle app...');
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('[Firebase Admin] App créée');
    } else {
      console.log('[Firebase Admin] Réutilisation de l\'app existante');
      app = admin.app();
    }

    db = app.firestore();
    console.log(`[Firebase Admin] Initialisé en ${Date.now() - initStartTime}ms`);
  } catch (error) {
    console.error('[Firebase Admin] Error initializing:', error);
    console.error('[Firebase Admin] Error details:', error instanceof Error ? error.stack : String(error));
    throw new Error(
      `Firebase Admin initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Retourne l'instance Firestore Admin (initialise si nécessaire)
 */
export function getAdminDb(): admin.firestore.Firestore {
  if (!db) {
    initializeAdmin();
  }
  return db!;
}
