import { NextRequest, NextResponse } from 'next/server';
import { checkAdminToken } from '@/lib/middleware';
import { getEventLogsByType } from '@/lib/firebase/firestore-admin';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  if (!checkAdminToken(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const db = getAdminDb();

    // Comptages simples (scan). OK pour MVP; on optimisera ensuite via agrégations.
    const [profilesSnap, eventsSnap] = await Promise.all([
      db.collection('profiles').get(),
      db.collection('event_logs').get(),
    ]);

    const [
      profileCreated,
      freeReportViewed,
      unlockClicked,
      moduleUnlocked,
      reportGenerated,
      errorAi,
    ] = await Promise.all([
      getEventLogsByType('profile_created'),
      getEventLogsByType('free_report_viewed'),
      getEventLogsByType('unlock_clicked'),
      getEventLogsByType('module_unlocked'),
      getEventLogsByType('report_generated'),
      getEventLogsByType('error_ai'),
    ]);

    const moduleUnlocks = moduleUnlocked.slice(0, 10);

    return NextResponse.json({
      summary: {
        totalProfiles: profilesSnap.size,
        totalEvents: eventsSnap.size,
      },
      events: {
        profile_created: profileCreated.length,
        free_report_viewed: freeReportViewed.length,
        unlock_clicked: unlockClicked.length,
        module_unlocked: moduleUnlocked.length,
        report_generated: reportGenerated.length,
        error_ai: errorAi.length,
      },
      topModules: moduleUnlocks.slice(0, 5).map((m) => {
        const metadata = m.metadata ? JSON.parse(m.metadata) : {};
        return { module: metadata.moduleType || 'unknown', count: 1 };
      }),
    });
  } catch (error) {
    console.error('Erreur stats admin:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
