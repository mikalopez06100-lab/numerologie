import OpenAI from 'openai';
import { z } from 'zod';
import { freeReportSchema, premiumReportSchema, FreeReportContent, PremiumReportContent } from './schemas';
import { generateFallbackFreeReport, generateFallbackPremiumReport } from './fallback';
import type { ProfileData } from './prompts';
import { getFreeReportPrompt, getPromptForReportType } from './prompts';

const openaiApiKey = process.env.OPENAI_API_KEY;

// Log pour vérifier la configuration
if (openaiApiKey) {
  console.log('[OpenAI] Clé API détectée (longueur:', openaiApiKey.length, ')');
} else {
  console.warn('[OpenAI] Aucune clé API détectée, utilisation du fallback');
}

// Initialiser le client OpenAI seulement si la clé est présente
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

/**
 * Nettoie la réponse JSON en retirant les markdown code blocks si présents
 */
function cleanJsonResponse(text: string): string {
  // Retire les markdown code blocks
  let cleaned = text.trim();
  
  // Retire ```json au début
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '');
  }
  
  // Retire ``` à la fin
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3).trim();
  }
  
  return cleaned.trim();
}

/**
 * Parse et valide le JSON retourné par OpenAI
 */
function parseAndValidateJson<T>(
  text: string,
  schema: z.ZodSchema<T>
): T | null {
  try {
    const cleaned = cleanJsonResponse(text);
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  } catch (error) {
    console.error('Erreur de parsing/validation JSON:', error);
    return null;
  }
}

/**
 * Génère un rapport gratuit via OpenAI ou fallback
 */
export async function generateFreeReport(
  data: ProfileData
): Promise<FreeReportContent> {
  const startTime = Date.now();
  console.log('[OpenAI] Génération du rapport gratuit...');
  
  if (!openai) {
    console.log('[OpenAI] OpenAI non configuré, utilisation du fallback');
    return generateFallbackFreeReport(data);
  }

  try {
    const prompt = getFreeReportPrompt(data);
    console.log('[OpenAI] Prompt généré, appel API...');

    // Timeout de 30 secondes pour éviter que la requête ne reste bloquée
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI timeout after 30s')), 30000);
    });

    const completionPromise = openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en numérologie. Tu réponds toujours en JSON valide, sans markdown, sans texte avant ou après.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
      max_tokens: 1000, // Limiter la réponse pour éviter les timeouts
    });

    console.log('[OpenAI] En attente de la réponse...');
    const completion = await Promise.race([completionPromise, timeoutPromise]) as any;
    console.log(`[OpenAI] Réponse reçue en ${Date.now() - startTime}ms`);

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Pas de contenu dans la réponse OpenAI');
    }

    console.log('[OpenAI] Validation du JSON...');
    const validated = parseAndValidateJson(content, freeReportSchema);
    if (validated) {
      console.log(`[OpenAI] Rapport généré avec succès en ${Date.now() - startTime}ms`);
      return validated;
    }

    // Si validation échoue, utiliser fallback
    console.warn('[OpenAI] Validation JSON échouée, utilisation du fallback');
    return generateFallbackFreeReport(data);
  } catch (error) {
    console.error(`[OpenAI] Erreur après ${Date.now() - startTime}ms:`, error);
    console.error('[OpenAI] Détails:', error instanceof Error ? error.message : String(error));
    return generateFallbackFreeReport(data);
  }
}

/**
 * Génère un rapport premium via OpenAI ou fallback
 */
export async function generatePremiumReport(
  type: string,
  data: ProfileData
): Promise<PremiumReportContent> {
  if (!openai) {
    console.log('OpenAI non configuré, utilisation du fallback');
    return generateFallbackPremiumReport(type, data);
  }

  try {
    const prompt = getPromptForReportType(type, data);

    // Timeout de 30 secondes pour éviter que la requête ne reste bloquée
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI timeout after 30s')), 30000);
    });

    const completionPromise = openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en numérologie. Tu réponds toujours en JSON valide, sans markdown, sans texte avant ou après.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
      max_tokens: 1500, // Limiter la réponse pour éviter les timeouts
    });

    const completion = await Promise.race([completionPromise, timeoutPromise]) as any;

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Pas de contenu dans la réponse OpenAI');
    }

    const validated = parseAndValidateJson(content, premiumReportSchema);
    if (validated) {
      return validated;
    }

    // Si validation échoue, utiliser fallback
    console.warn('Validation JSON échouée, utilisation du fallback');
    return generateFallbackPremiumReport(type, data);
  } catch (error) {
    console.error('Erreur OpenAI, utilisation du fallback:', error);
    return generateFallbackPremiumReport(type, data);
  }
}
