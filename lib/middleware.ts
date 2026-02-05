import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, getIdentifierFromRequest } from './rate-limit';

/**
 * Middleware pour sécurité et rate limiting
 */
export function securityMiddleware(request: NextRequest): NextResponse | null {
  const response = NextResponse.next();

  // Headers de sécurité basiques
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Rate limiting pour les routes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const identifier = getIdentifierFromRequest(request);
    const isAllowed = checkRateLimit(identifier, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requêtes max
    });

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }

    // Ajouter les headers de rate limit
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Window', '900'); // 15 minutes en secondes
  }

  return response;
}

/**
 * Vérifie le token admin pour les routes protégées
 */
export function checkAdminToken(request: NextRequest): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return false;
  }

  const token = request.headers.get('x-admin-token') || 
                request.nextUrl.searchParams.get('token');

  return token === adminToken;
}
