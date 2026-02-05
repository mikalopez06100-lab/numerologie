import { FreeReportContent, PremiumReportContent } from './schemas';
import type { ProfileData } from './prompts';

/**
 * Génère un rapport gratuit en fallback (sans OpenAI)
 */
export function generateFallbackFreeReport(data: ProfileData): FreeReportContent {
  const lifePathMeanings: Record<number, string> = {
    1: 'leader naturel, indépendant, pionnier',
    2: 'coopératif, diplomate, sensible',
    3: 'créatif, expressif, communicatif',
    4: 'structuré, pratique, fiable',
    5: 'aventurier, libre, curieux',
    6: 'nurturant, responsable, harmonieux',
    7: 'spirituel, analytique, introspectif',
    8: 'ambitieux, organisé, matérialiste',
    9: 'humanitaire, généreux, idéaliste',
  };

  const expressionMeanings: Record<number, string> = {
    1: 'leadership et innovation',
    2: 'coopération et harmonie',
    3: 'créativité et expression',
    4: 'organisation et stabilité',
    5: 'liberté et exploration',
    6: 'service et responsabilité',
    7: 'sagesse et introspection',
    8: 'ambition et réussite',
    9: 'altruisme et idéalisme',
  };

  const lifePathDesc = lifePathMeanings[data.lifePath] || 'unique et spécial';
  const expressionDesc = expressionMeanings[data.expression] || 'remarquable';

  return {
    portrait: `${data.firstName}, votre chemin de vie ${data.lifePath} révèle une personnalité ${lifePathDesc}. Votre nombre d'expression ${data.expression} met en lumière vos talents pour ${expressionDesc}. Votre aspiration de l'âme ${data.soulUrge} guide vos motivations profondes et vos désirs authentiques. Ensemble, ces nombres tracent un portrait unique qui reflète votre essence véritable.`,
    forces: [
      `Votre chemin de vie ${data.lifePath} vous confère des qualités naturelles exceptionnelles`,
      `Votre expression ${data.expression} révèle des talents uniques à exploiter`,
      `Votre aspiration de l'âme ${data.soulUrge} guide vos choix vers l'authenticité`,
    ],
    defis: [
      'Apprendre à équilibrer vos forces naturelles avec les défis de la vie',
      'Développer une meilleure compréhension de vos motivations profondes',
    ],
    insight: `Votre profil numérologique révèle une combinaison unique de ${lifePathDesc} et de ${expressionDesc}. Cette synergie crée un potentiel remarquable pour votre développement personnel. Votre aspiration de l'âme ${data.soulUrge} vous pousse vers des expériences authentiques qui résonnent avec votre être profond. En alignant vos actions avec ces énergies, vous pouvez réaliser votre plein potentiel et vivre une vie en harmonie avec votre nature véritable.`,
    outro: `Ce premier aperçu de votre profil numérologique n'est qu'un début. Découvrez nos analyses approfondies pour explorer chaque dimension de votre personnalité et de votre chemin de vie.`,
  };
}

/**
 * Génère un rapport premium en fallback
 */
export function generateFallbackPremiumReport(
  type: string,
  data: ProfileData
): PremiumReportContent {
  const baseIntro = `Analyse numérologique ${type} pour ${data.firstName} ${data.lastName}`;
  
  return {
    introduction: `${baseIntro}. Cette analyse se base sur votre chemin de vie ${data.lifePath}, votre expression ${data.expression} et votre aspiration de l'âme ${data.soulUrge}.`,
    analyse: `Votre profil numérologique révèle des énergies spécifiques pour cette période. Votre chemin de vie ${data.lifePath} influence significativement votre expérience, tandis que votre expression ${data.expression} guide vos talents et capacités. Votre aspiration de l'âme ${data.soulUrge} révèle vos motivations profondes. En comprenant ces interactions, vous pouvez mieux naviguer les opportunités et défis qui se présentent.`,
    conseils: [
      'Restez aligné avec votre chemin de vie pour maximiser votre potentiel',
      'Utilisez vos talents d\'expression pour créer des opportunités',
      'Écoutez votre aspiration de l\'âme pour prendre des décisions authentiques',
      'Cultivez la patience et la persévérance dans vos projets',
    ],
    conclusion: `Cette analyse offre un aperçu précieux de votre profil numérologique. En intégrant ces insights dans votre vie quotidienne, vous pouvez progresser vers une meilleure compréhension de vous-même et de votre chemin.`,
  };
}
