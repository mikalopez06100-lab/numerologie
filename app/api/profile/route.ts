import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createProfile, createNumerology, createReport } from '@/lib/firebase/firestore';
import { createProfileSchema } from '@/lib/validations';
import {
  calculateLifePath,
  calculateExpression,
  calculateSoulUrge,
  calculatePersonality,
} from '@/lib/numerology';
import { generateFreeReport } from '@/lib/ai/openai';
import type { ProfileData } from '@/lib/ai/prompts';
import { logEventAsync } from '@/lib/tracking';

export async function POST(request: NextRequest) {
  try {
    // Vérifier que Firebase est configuré
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.error('Firebase not configured');
      return NextResponse.json(
        { error: 'Configuration Firebase manquante' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validatedData = createProfileSchema.parse(body);

    // Calculs numérologiques
    const lifePath = calculateLifePath(validatedData.birthDate, false);
    const expression = calculateExpression(
      validatedData.firstName,
      validatedData.lastName
    );
    const soulUrge = calculateSoulUrge(
      validatedData.firstName,
      validatedData.lastName
    );
    const personality = calculatePersonality(
      validatedData.firstName,
      validatedData.lastName
    );

    // Création du profil
    const profile = await createProfile({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      birthDate: validatedData.birthDate,
      birthPlace: validatedData.birthPlace || null,
    });

    // Création de la numérologie
    const numerology = await createNumerology({
      profileId: profile.id,
      lifePath,
      expression,
      soulUrge,
      personality,
    });

    // Générer le rapport gratuit (FREE)
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

    const freeReportContent = await generateFreeReport(profileData);

    // Sauvegarder le rapport FREE
    await createReport({
      profileId: profile.id,
      type: 'FREE',
      contentJson: JSON.stringify(freeReportContent),
    });

    // Logger l'événement
    logEventAsync('profile_created', { profileId: profile.id }, profile.id);
    logEventAsync('report_generated', { type: 'FREE', profileId: profile.id }, profile.id);

    return NextResponse.json(
      {
        profileId: profile.id,
        numerology: {
          id: numerology.id,
          profileId: numerology.profileId,
          lifePath: numerology.lifePath,
          expression: numerology.expression,
          soulUrge: numerology.soulUrge,
          personality: numerology.personality,
          createdAt: numerology.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Logger les erreurs avec plus de détails en développement
    console.error('Error in POST /api/profile:', error);
    
    if (error instanceof Error && error.message.includes('AI')) {
      logEventAsync('error_ai', { error: error.message });
    }

    // Erreur de validation Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Les données fournies sont invalides. Veuillez vérifier votre saisie.' },
        { status: 400 }
      );
    }
    // Erreur de calcul numérologique
    if (error instanceof Error && error.message.includes('Date')) {
      return NextResponse.json(
        { error: 'La date de naissance est invalide. Format attendu: YYYY-MM-DD' },
        { status: 400 }
      );
    }
    // Erreur générique
    if (error instanceof Error) {
      // Masquer les détails techniques en production
      const isProduction = process.env.NODE_ENV === 'production';
      return NextResponse.json(
        { 
          error: isProduction 
            ? 'Une erreur est survenue. Veuillez réessayer plus tard.' 
            : error.message 
        },
        { status: 400 }
      );
    }
    // Erreur inconnue
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}
