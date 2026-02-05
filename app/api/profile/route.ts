import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
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

    // Création du profil et de la numérologie en transaction
    const profile = await prisma.profile.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        birthDate: validatedData.birthDate,
        birthPlace: validatedData.birthPlace,
        numerology: {
          create: {
            lifePath,
            expression,
            soulUrge,
            personality,
          },
        },
      },
      include: {
        numerology: true,
      },
    });

    // Générer le rapport gratuit (FREE)
    const profileData: ProfileData = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: profile.birthDate,
      birthPlace: profile.birthPlace,
      lifePath: profile.numerology!.lifePath,
      expression: profile.numerology!.expression,
      soulUrge: profile.numerology!.soulUrge,
      personality: profile.numerology!.personality,
    };

    const freeReportContent = await generateFreeReport(profileData);

    // Sauvegarder le rapport FREE (convertir JSON en string pour SQLite)
    await prisma.report.create({
      data: {
        profileId: profile.id,
        type: 'FREE',
        contentJson: JSON.stringify(freeReportContent),
      },
    });

    // Logger l'événement
    logEventAsync('profile_created', { profileId: profile.id }, profile.id);
    logEventAsync('report_generated', { type: 'FREE', profileId: profile.id }, profile.id);

    return NextResponse.json(
      {
        profileId: profile.id,
        numerology: profile.numerology,
      },
      { status: 201 }
    );
  } catch (error) {
    // Logger les erreurs
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
