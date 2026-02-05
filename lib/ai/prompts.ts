export interface ProfileData {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace?: string | null;
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality?: number | null;
}

/**
 * Construit le prompt de base avec les informations du profil
 */
function buildBaseContext(data: ProfileData): string {
  const birthPlaceText = data.birthPlace ? `, né(e) à ${data.birthPlace}` : '';
  return `
Informations du profil :
- Nom complet : ${data.firstName} ${data.lastName}
- Date de naissance : ${data.birthDate}${birthPlaceText}
- Chemin de vie : ${data.lifePath}
- Nombre d'expression : ${data.expression}
- Aspiration de l'âme : ${data.soulUrge}
${data.personality ? `- Personnalité : ${data.personality}` : ''}
`;
}

/**
 * Prompt pour le rapport gratuit (FREE)
 */
export function getFreeReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport numérologique gratuit pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec les champs suivants :
- portrait : Un portrait numérologique expressif et personnel (150-200 mots) qui capture l'essence de la personne
- forces : Un tableau de 3 à 5 forces principales basées sur les nombres numérologiques
- defis : Un tableau de 2 à 4 défis ou opportunités de croissance
- insight : Un insight profond et personnel (150-200 mots) qui révèle quelque chose de significatif
- outro : Une ouverture subtile et engageante (50-100 mots) qui invite à découvrir plus

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks, sans texte avant ou après. Format exact :
{
  "portrait": "...",
  "forces": ["...", "..."],
  "defis": ["...", "..."],
  "insight": "...",
  "outro": "..."
}`;
}

/**
 * Prompt pour l'année personnelle (YEAR)
 */
export function getYearReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport détaillé sur l'année personnelle pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec :
- introduction : Présentation de l'année personnelle (100-150 mots)
- analyse : Analyse approfondie des énergies de l'année (400-500 mots)
- conseils : Tableau de 4 à 6 conseils pratiques pour cette année
- conclusion : Synthèse et perspectives (100-150 mots)
- energies : Tableau des énergies principales à cultiver cette année

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks.`;
}

/**
 * Prompt pour le mois personnel (MONTH)
 */
export function getMonthReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport sur le mois personnel pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec :
- introduction : Présentation du mois personnel (100-150 mots)
- analyse : Analyse des énergies du mois (400-500 mots)
- conseils : Tableau de 4 à 6 conseils pratiques pour ce mois
- conclusion : Synthèse et recommandations (100-150 mots)

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks.`;
}

/**
 * Prompt pour les 12 prochains mois (NEXT_12_MONTHS)
 */
export function getNext12MonthsReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport de prévisions pour les 12 prochains mois pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec :
- introduction : Présentation de la période (100-150 mots)
- analyse : Analyse globale des 12 prochains mois (500-600 mots)
- predictions : Tableau de prédictions pour chaque trimestre (4 prédictions)
- conseils : Tableau de 5 à 7 conseils pour naviguer cette période
- conclusion : Synthèse et perspectives (100-150 mots)

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks.`;
}

/**
 * Prompt pour la relation maternelle (MOTHER)
 */
export function getMotherReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport sur la relation maternelle pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec :
- introduction : Présentation de la relation maternelle (100-150 mots)
- analyse : Analyse approfondie de la dynamique avec la mère (400-500 mots)
- conseils : Tableau de 4 à 6 conseils pour améliorer cette relation
- conclusion : Synthèse et perspectives (100-150 mots)

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks.`;
}

/**
 * Prompt pour la relation paternelle (FATHER)
 */
export function getFatherReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport sur la relation paternelle pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec :
- introduction : Présentation de la relation paternelle (100-150 mots)
- analyse : Analyse approfondie de la dynamique avec le père (400-500 mots)
- conseils : Tableau de 4 à 6 conseils pour améliorer cette relation
- conclusion : Synthèse et perspectives (100-150 mots)

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks.`;
}

/**
 * Prompt pour la carrière et le travail (WORK)
 */
export function getWorkReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport sur la carrière et le travail pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec :
- introduction : Présentation de la dimension professionnelle (100-150 mots)
- analyse : Analyse approfondie du chemin de carrière (400-500 mots)
- conseils : Tableau de 5 à 7 conseils pour la réussite professionnelle
- conclusion : Synthèse et perspectives de carrière (100-150 mots)

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks.`;
}

/**
 * Prompt pour l'amour et les relations (LOVE)
 */
export function getLoveReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport sur l'amour et les relations pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec :
- introduction : Présentation de la dimension amoureuse (100-150 mots)
- analyse : Analyse approfondie des relations amoureuses (400-500 mots)
- compatibilite : Analyse de compatibilité numérologique (200-300 mots)
- conseils : Tableau de 4 à 6 conseils pour les relations
- conclusion : Synthèse et perspectives amoureuses (100-150 mots)

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks.`;
}

/**
 * Prompt pour la mission de vie (MISSION)
 */
export function getMissionReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport sur la mission de vie pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec :
- introduction : Présentation de la mission de vie (100-150 mots)
- analyse : Analyse approfondie de la mission et du chemin de vie (500-600 mots)
- conseils : Tableau de 5 à 7 conseils pour accomplir sa mission
- conclusion : Synthèse et perspectives (100-150 mots)

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks.`;
}

/**
 * Prompt pour le profil approfondi (DEEP_PROFILE)
 */
export function getDeepProfileReportPrompt(data: ProfileData): string {
  return `Tu es un expert en numérologie. Génère un rapport approfondi et complet pour ${data.firstName} ${data.lastName}.

${buildBaseContext(data)}

Génère un rapport JSON structuré avec :
- introduction : Présentation du profil approfondi (150-200 mots)
- analyse : Analyse complète et détaillée de tous les aspects numérologiques (800-1000 mots)
- conseils : Tableau de 6 à 8 conseils personnalisés
- energies : Tableau des énergies principales à développer
- conclusion : Synthèse complète et perspectives (150-200 mots)

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans code blocks.`;
}

/**
 * Récupère le prompt approprié selon le type de rapport
 */
export function getPromptForReportType(
  type: string,
  data: ProfileData
): string {
  switch (type) {
    case 'FREE':
      return getFreeReportPrompt(data);
    case 'YEAR':
      return getYearReportPrompt(data);
    case 'MONTH':
      return getMonthReportPrompt(data);
    case 'NEXT_12_MONTHS':
      return getNext12MonthsReportPrompt(data);
    case 'LOVE':
      return getLoveReportPrompt(data);
    case 'MOTHER':
      return getMotherReportPrompt(data);
    case 'FATHER':
      return getFatherReportPrompt(data);
    case 'WORK':
      return getWorkReportPrompt(data);
    case 'MISSION':
      return getMissionReportPrompt(data);
    case 'DEEP_PROFILE':
      return getDeepProfileReportPrompt(data);
    default:
      return getFreeReportPrompt(data);
  }
}
