/**
 * Rate limiting simple en mémoire
 * Pour production, utiliser Redis ou un service dédié
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Nettoyer les entrées expirées toutes les 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  windowMs: number; // Fenêtre de temps en ms
  maxRequests: number; // Nombre max de requêtes
}

const defaultOptions: RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requêtes max
};

/**
 * Vérifie si une requête est autorisée selon le rate limit
 * @param identifier Identifiant unique (IP, userId, etc.)
 * @param options Options de rate limiting
 * @returns true si autorisé, false sinon
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = defaultOptions
): boolean {
  const now = Date.now();
  const entry = store[identifier];

  // Pas d'entrée ou fenêtre expirée
  if (!entry || entry.resetAt < now) {
    store[identifier] = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    return true;
  }

  // Vérifier le nombre de requêtes
  if (entry.count >= options.maxRequests) {
    return false;
  }

  // Incrémenter le compteur
  entry.count++;
  return true;
}

/**
 * Récupère l'identifiant depuis la requête (IP)
 */
export function getIdentifierFromRequest(request: Request): string {
  // Essayer de récupérer l'IP depuis les headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  return ip;
}
