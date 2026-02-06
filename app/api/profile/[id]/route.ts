import { NextRequest, NextResponse } from 'next/server';
import {
  getProfile,
  getNumerologyByProfileId,
  getUnlocksByProfileId,
  getReportsByProfileId,
} from '@/lib/firebase/firestore-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [profile, numerology, unlocks, reports] = await Promise.all([
      getProfile(id),
      getNumerologyByProfileId(id),
      getUnlocksByProfileId(id),
      getReportsByProfileId(id),
    ]);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ...profile,
        numerology,
        unlocks,
        reports,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}


