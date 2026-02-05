import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminToken } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  // Vérifier le token admin
  if (!checkAdminToken(request)) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    // Statistiques simples
    const [
      totalProfiles,
      totalEvents,
      profileCreated,
      freeReportViewed,
      unlockClicked,
      moduleUnlocked,
      reportGenerated,
      errorAi,
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.eventLog.count(),
      prisma.eventLog.count({ where: { eventType: 'profile_created' } }),
      prisma.eventLog.count({ where: { eventType: 'free_report_viewed' } }),
      prisma.eventLog.count({ where: { eventType: 'unlock_clicked' } }),
      prisma.eventLog.count({ where: { eventType: 'module_unlocked' } }),
      prisma.eventLog.count({ where: { eventType: 'report_generated' } }),
      prisma.eventLog.count({ where: { eventType: 'error_ai' } }),
    ]);

    // Top modules débloqués (simplifié pour SQLite)
    const moduleUnlocks = await prisma.eventLog.findMany({
      where: {
        eventType: 'module_unlocked',
      },
      take: 10,
    });

    return NextResponse.json({
      summary: {
        totalProfiles,
        totalEvents,
      },
      events: {
        profile_created: profileCreated,
        free_report_viewed: freeReportViewed,
        unlock_clicked: unlockClicked,
        module_unlocked: moduleUnlocked,
        report_generated: reportGenerated,
        error_ai: errorAi,
      },
      topModules: moduleUnlocks.slice(0, 5).map((m) => ({
        module: m.metadata || 'unknown',
        count: 1,
      })),
    });
  } catch (error) {
    console.error('Erreur stats admin:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
