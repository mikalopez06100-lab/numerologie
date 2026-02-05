import { prisma } from './prisma';

export type EventType =
  | 'profile_created'
  | 'free_report_viewed'
  | 'unlock_clicked'
  | 'module_unlocked'
  | 'report_generated'
  | 'error_ai'
  | 'upsell_shown'
  | 'upsell_clicked';

interface EventMetadata {
  [key: string]: unknown;
}

/**
 * Log un événement dans la base de données
 * Ne bloque pas l'exécution en cas d'erreur (fail silently)
 */
export async function logEvent(
  eventType: EventType,
  metadata?: EventMetadata,
  profileId?: string
): Promise<void> {
  try {
    await prisma.eventLog.create({
      data: {
        eventType,
        metadata: metadata || {},
        profileId: profileId || null,
      },
    });
  } catch (error) {
    // Fail silently pour ne pas interrompre le flux principal
    console.error('Erreur lors du logging:', error);
  }
}

/**
 * Log un événement de manière synchrone (non-bloquant)
 * Utilise un setTimeout pour ne pas bloquer la réponse
 */
export function logEventAsync(
  eventType: EventType,
  metadata?: EventMetadata,
  profileId?: string
): void {
  // Exécute de manière asynchrone sans attendre
  setTimeout(() => {
    logEvent(eventType, metadata, profileId).catch(() => {
      // Ignore les erreurs
    });
  }, 0);
}
