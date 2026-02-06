import { NextRequest, NextResponse } from 'next/server';
import {
  getProfile,
  getNumerologyByProfileId,
  getUnlockByProfileAndModule,
  createOrUpdateUnlock,
  createReport,
} from '@/lib/firebase/firestore-admin';
import { z } from 'zod';
import { generatePremiumReport } from '@/lib/ai/openai';
import type { ProfileData } from '@/lib/ai/prompts';
import { logEventAsync } from '@/lib/tracking';

const unlockSchema = z.object({
  profileId: z.string().min(1),
  moduleType: z.enum([
    'YEAR',
    'MONTH',
    'NEXT_12_MONTHS',
    'LOVE',
    'MOTHER',
    'FATHER',
    'WORK',
    'MISSION',
    'DEEP_PROFILE',
  ]),
});

// Mapping des ModuleType vers ReportType
const MODULE_TO_REPORT_TYPE: Record<string, 'YEAR' | 'MONTH' | 'NEXT_12_MONTHS' | 'LOVE' | 'MOTHER' | 'FATHER' | 'WORK' | 'MISSION' | 'DEEP_PROFILE'> = {
  YEAR: 'YEAR',
  MONTH: 'MONTH',
  NEXT_12_MONTHS: 'NEXT_12_MONTHS',
  LOVE: 'LOVE',
  MOTHER: 'MOTHER',
  FATHER: 'FATHER',
  WORK: 'WORK',
  MISSION: 'MISSION',
  DEEP_PROFILE: 'DEEP_PROFILE',
};

export async function POST(request: NextRequest) {
  let profileId: string | undefined;
  let moduleType: string | undefined;
  
  try {
    const body = await request.json();
    const parsed = unlockSchema.parse(body);
    profileId = parsed.profileId;
    moduleType = parsed.moduleType;

    // Vérifier que le profil existe et récupérer la numérologie
    const [profile, numerology] = await Promise.all([
      getProfile(profileId),
      getNumerologyByProfileId(profileId),
    ]);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      );
    }

    if (!numerology) {
      return NextResponse.json(
        { error: 'Numérologie non trouvée pour ce profil' },
        { status: 404 }
      );
    }

    // Simuler le paiement (mock - toujours OK)
    // Dans une vraie app, on vérifierait ici le paiement SMS

    // Vérifier si l'unlock existe déjà
    const existingUnlock = await getUnlockByProfileAndModule(profileId, moduleType);
    
    // Créer ou mettre à jour l'unlock
    const unlock = await createOrUpdateUnlock({
      profileId,
      moduleType,
      isUnlocked: true,
      unlockedAt: new Date(),
    });

    // Générer le rapport premium pour ce module
    const reportType = MODULE_TO_REPORT_TYPE[moduleType];
    if (!reportType) {
      return NextResponse.json(
        { error: 'Type de module invalide' },
        { status: 400 }
      );
    }

    const profileData: ProfileData = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: profile.birthDate,
      birthPlace: profile.birthPlace || undefined,
      lifePath: numerology.lifePath,
      expression: numerology.expression,
      soulUrge: numerology.soulUrge,
      personality: numerology.personality || undefined,
    };

    let reportContent;
    try {
      reportContent = await generatePremiumReport(moduleType, profileData);
    } catch (error) {
      // Logger l'erreur AI
      logEventAsync('error_ai', { 
        moduleType, 
        profileId: profile.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, profile.id);
      throw error;
    }

    // Sauvegarder le rapport
    await createReport({
      profileId: profile.id,
      type: reportType,
      contentJson: JSON.stringify(reportContent),
    });

    // Logger les événements
    logEventAsync('module_unlocked', { moduleType, profileId: profile.id }, profile.id);
    logEventAsync('report_generated', { type: reportType, profileId: profile.id }, profile.id);

    return NextResponse.json(
      {
        unlock,
        message: 'Module débloqué et rapport généré avec succès',
      },
      { status: existingUnlock ? 200 : 201 }
    );
  } catch (error) {
    // Logger les erreurs
    if (error instanceof Error && error.message.includes('AI') && moduleType && profileId) {
      logEventAsync('error_ai', { 
        moduleType,
        profileId,
        error: error.message 
      }, profileId);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Les données fournies sont invalides.' },
        { status: 400 }
      );
    }

    const isProduction = process.env.NODE_ENV === 'production';
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: isProduction 
            ? 'Une erreur est survenue lors du déblocage. Veuillez réessayer.' 
            : error.message 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}


