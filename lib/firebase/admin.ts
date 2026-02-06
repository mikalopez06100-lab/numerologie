import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;

/**
 * Initialise Firebase Admin SDK
 * Utilise le service account JSON depuis les variables d'environnement
 */
export function getAdminApp(): admin.app.App {
  if (app) {
    return app;
  }

  // Vérifier que le service account est configuré
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  
  if (!serviceAccountJson) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_JSON is not set. Please configure it in Vercel environment variables.'
    );
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    if (!app) {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    return app;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw new Error(
      `Failed to initialize Firebase Admin: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Retourne l'instance Firestore Admin
 */
export function getAdminDb(): admin.firestore.Firestore {
  const adminApp = getAdminApp();
  return adminApp.firestore();
}
