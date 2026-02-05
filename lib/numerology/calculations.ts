import { letterToNumber, wordToNumbers, reduceNumber } from './table';

/**
 * Calcule le chemin de vie à partir d'une date de naissance (format: YYYY-MM-DD)
 */
export function calculateLifePath(
  birthDate: string,
  allowMasterNumbers: boolean = false
): number {
  const [year, month, day] = birthDate.split('-').map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error('Date de naissance invalide. Format attendu: YYYY-MM-DD');
  }

  // Réduire jour, mois, année
  const reducedDay = reduceNumber(day, false);
  const reducedMonth = reduceNumber(month, false);
  const reducedYear = reduceNumber(year, false);

  // Somme des trois
  const sum = reducedDay + reducedMonth + reducedYear;

  // Réduction finale (avec possibilité de nombre maître)
  return reduceNumber(sum, allowMasterNumbers);
}

/**
 * Calcule le nombre d'expression à partir du prénom et nom complet
 */
export function calculateExpression(
  firstName: string,
  lastName: string
): number {
  const fullName = `${firstName} ${lastName}`;
  const numbers = wordToNumbers(fullName);
  
  if (numbers.length === 0) {
    throw new Error('Le nom doit contenir au moins une lettre');
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return reduceNumber(sum, false);
}

/**
 * Vérifie si une lettre est une voyelle (A, E, I, O, U, Y)
 */
function isVowel(char: string): boolean {
  const normalized = char.toUpperCase();
  return ['A', 'E', 'I', 'O', 'U', 'Y'].includes(normalized);
}

/**
 * Calcule le nombre d'aspiration de l'âme (soul urge) basé sur les voyelles
 */
export function calculateSoulUrge(
  firstName: string,
  lastName: string
): number {
  const fullName = `${firstName} ${lastName}`;
  const vowelNumbers: number[] = [];

  for (const char of fullName) {
    if (char === ' ' || char === '-') {
      continue;
    }
    if (isVowel(char)) {
      const num = letterToNumber(char);
      if (num !== null) {
        vowelNumbers.push(num);
      }
    }
  }

  if (vowelNumbers.length === 0) {
    throw new Error('Le nom doit contenir au moins une voyelle');
  }

  const sum = vowelNumbers.reduce((acc, num) => acc + num, 0);
  return reduceNumber(sum, false);
}

/**
 * Calcule le nombre de personnalité basé sur les consonnes
 */
export function calculatePersonality(
  firstName: string,
  lastName: string
): number {
  const fullName = `${firstName} ${lastName}`;
  const consonantNumbers: number[] = [];

  for (const char of fullName) {
    if (char === ' ' || char === '-') {
      continue;
    }
    if (!isVowel(char)) {
      const num = letterToNumber(char);
      if (num !== null) {
        consonantNumbers.push(num);
      }
    }
  }

  if (consonantNumbers.length === 0) {
    throw new Error('Le nom doit contenir au moins une consonne');
  }

  const sum = consonantNumbers.reduce((acc, num) => acc + num, 0);
  return reduceNumber(sum, false);
}
