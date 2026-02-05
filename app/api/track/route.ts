import { NextRequest, NextResponse } from 'next/server';
import { logEventAsync } from '@/lib/tracking';
import { z } from 'zod';

const trackSchema = z.object({
  eventType: z.enum([
    'profile_created',
    'free_report_viewed',
    'unlock_clicked',
    'module_unlocked',
    'report_generated',
    'error_ai',
    'upsell_shown',
    'upsell_clicked',
  ]),
  profileId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, profileId, metadata } = trackSchema.parse(body);

    // Logger l'événement de manière asynchrone
    logEventAsync(eventType, metadata, profileId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Fail silently pour ne pas interrompre le flux
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
