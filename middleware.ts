import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityMiddleware } from './lib/middleware';

export function middleware(request: NextRequest) {
  return securityMiddleware(request);
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
