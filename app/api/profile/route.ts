import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createProfile, createNumerology, createReport } from '@/lib/firebase/firestore-admin';
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
  const startTime = Date.now();
  console.log('[API] POST /api/profile - Début');
  
  try {
    // Vérifier que Firebase Admin est configuré
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      console.error('[API] FIREBASE_SERVICE_ACCOUNT_JSON not set');
      return NextResponse.json(
        { error: 'Configuration Firebase Admin manquante' },
        { status: 500 }
      );
    }
    console.log('[API] Firebase Admin config OK');

    let body;
    try {
      body = await request.json();
      console.log('[API] Body parsé:', { firstName: body.firstName, lastName: body.lastName });
    } catch (error) {
      console.error('[API] Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 400 }
      );
    }

    let validatedData;
    try {
      validatedData = createProfileSchema.parse(body);
      console.log('[API] Données validées');
    } catch (error) {
      console.error('[API] Validation error:', error);
      return NextResponse.json(
        { error: 'Les données fournies sont invalides. Veuillez vérifier votre saisie.' },
        { status: 400 }
      );
    }

    // Calculs numérologiques
    console.log('[API] Calculs numérologiques...');
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
    console.log('[API] Calculs terminés:', { lifePath, expression, soulUrge, personality });

    // Création du profil
    let profile;
    try {
      console.log('[API] Création du profil...');
      const profileStartTime = Date.now();
      profile = await createProfile({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        birthDate: validatedData.birthDate,
        birthPlace: validatedData.birthPlace || null,
      });
      console.log(`[API] Profil créé en ${Date.now() - profileStartTime}ms:`, profile.id);
    } catch (error) {
      console.error('[API] Error creating profile:', error);
      console.error('[API] Error details:', error instanceof Error ? error.message : String(error));
      return NextResponse.json(
        { error: `Erreur lors de la création du profil: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
        { status: 500 }
      );
    }

    // Création de la numérologie
    let numerology;
    try {
      console.log('[API] Création de la numérologie...');
      const numerologyStartTime = Date.now();
      numerology = await createNumerology({
        profileId: profile.id,
        lifePath,
        expression,
        soulUrge,
        personality,
      });
      console.log(`[API] Numérologie créée en ${Date.now() - numerologyStartTime}ms:`, numerology.id);
    } catch (error) {
      console.error('[API] Error creating numerology:', error);
      console.error('[API] Error details:', error instanceof Error ? error.message : String(error));
      return NextResponse.json(
        { error: `Erreur lors du calcul numérologique: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
        { status: 500 }
      );
    }

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

    // Générer le rapport gratuit de manière asynchrone (ne pas bloquer la réponse)
    // On répond immédiatement et on génère le rapport en arrière-plan
    setImmediate(async () => {
      const bgStartTime = Date.now();
      try {
        console.log('[Background] Début génération du rapport gratuit...');
        const freeReportContent = await generateFreeReport(profileData);
        console.log(`[Background] Rapport généré en ${Date.now() - bgStartTime}ms`);
        
        // Sauvegarder le rapport FREE avec timeout
        console.log('[Background] Sauvegarde du rapport...');
        const saveStartTime = Date.now();
        await Promise.race([
          createReport({
            profileId: profile.id,
            type: 'FREE',
            contentJson: JSON.stringify(freeReportContent),
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Report save timeout')), 10000)
          )
        ]);
        console.log(`[Background] Rapport sauvegardé en ${Date.now() - saveStartTime}ms (total: ${Date.now() - bgStartTime}ms)`);
      } catch (error) {
        console.error(`[Background] Erreur après ${Date.now() - bgStartTime}ms:`, error);
        console.error('[Background] Détails:', error instanceof Error ? error.message : String(error));
        // Utiliser le fallback si OpenAI échoue
        try {
          console.log('[Background] Création du rapport fallback...');
          const fallbackReport = {
            portrait: `Bonjour ${profile.firstName}, votre profil numérologique révèle des traits uniques basés sur votre chemin de vie ${numerology.lifePath}, votre expression ${numerology.expression} et votre aspiration ${numerology.soulUrge}.`,
            forces: [
              'Capacité d\'adaptation remarquable',
              'Intuition développée',
              'Sens de la communication',
            ],
            defis: [
              'Apprendre à mieux gérer le stress',
              'Développer la patience',
            ],
            insight: 'Votre parcours de vie est marqué par une recherche constante d\'équilibre et d\'harmonie. Les nombres qui vous accompagnent suggèrent un potentiel créatif et une capacité à inspirer les autres.',
            outro: 'Découvrez maintenant vos analyses premium pour approfondir votre connaissance de vous-même.',
          };
          await createReport({
            profileId: profile.id,
            type: 'FREE',
            contentJson: JSON.stringify(fallbackReport),
          });
          console.log('[Background] Rapport fallback sauvegardé');
        } catch (saveError) {
          console.error('[Background] Erreur lors de la sauvegarde du fallback:', saveError);
        }
      }
    });

    // Logger l'événement (asynchrone, ne bloque pas)
    logEventAsync('profile_created', { profileId: profile.id }, profile.id);

    const elapsed = Date.now() - startTime;
    console.log(`[API] Réponse envoyée en ${elapsed}ms`);

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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    // TOUJOURS retourner du JSON, même en cas d'erreur
    try {
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
          { status: 500 }
        );
      }
      // Erreur inconnue
      return NextResponse.json(
        { error: 'Une erreur est survenue. Veuillez réessayer plus tard.' },
        { status: 500 }
      );
    } catch (jsonError) {
      // Si même le JSON échoue, retourner une réponse minimale
      console.error('Error creating JSON response:', jsonError);
      return new NextResponse(
        JSON.stringify({ error: 'Erreur serveur interne' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
}
