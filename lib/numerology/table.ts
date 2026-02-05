/**
 * Table pythagoricienne pour la numérologie
 * A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
 * Puis cycle: J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9, S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8
 */

const CHAR_TO_NUMBER: Record<string, number> = {
  // Premier cycle (A-I)
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  // Deuxième cycle (J-R)
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  // Troisième cycle (S-Z)
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

/**
 * Normalise un caractère en supprimant les accents et en le convertissant en majuscule
 */
function normalizeChar(char: string): string {
  return char
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .toUpperCase();
}

/**
 * Convertit une lettre en nombre selon la table pythagoricienne
 * Retourne null si ce n'est pas une lettre
 */
export function letterToNumber(letter: string): number | null {
  const normalized = normalizeChar(letter);
  return CHAR_TO_NUMBER[normalized] ?? null;
}

/**
 * Convertit un mot en tableau de nombres (ignore les espaces et traits d'union)
 */
export function wordToNumbers(word: string): number[] {
  const numbers: number[] = [];
  for (const char of word) {
    if (char === ' ' || char === '-') {
      continue; // Ignore espaces et traits d'union
    }
    const num = letterToNumber(char);
    if (num !== null) {
      numbers.push(num);
    }
  }
  return numbers;
}

/**
 * Réduit un nombre à un chiffre (1-9) ou un nombre maître (11, 22, 33)
 */
export function reduceNumber(
  num: number,
  allowMasterNumbers: boolean = false
): number {
  if (num <= 9) {
    return num;
  }

  // Vérifie les nombres maîtres si activé
  if (allowMasterNumbers) {
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
  }

  // Réduction classique
  let current = num;
  while (current > 9) {
    const digits = current.toString().split('').map(Number);
    current = digits.reduce((sum, digit) => sum + digit, 0);
    
    // Re-vérifie les nombres maîtres après réduction
    if (allowMasterNumbers && (current === 11 || current === 22 || current === 33)) {
      return current;
    }
  }

  return current;
}
