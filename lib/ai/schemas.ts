import { z } from 'zod';

// Schéma pour le rapport FREE
export const freeReportSchema = z.object({
  portrait: z.string().min(50, 'Le portrait doit contenir au moins 50 caractères'),
  forces: z.array(z.string()).min(3, 'Au moins 3 forces requises').max(5),
  defis: z.array(z.string()).min(2, 'Au moins 2 défis requis').max(4),
  insight: z.string().min(100, 'L\'insight doit contenir au moins 100 caractères'),
  outro: z.string().min(50, 'L\'outro doit contenir au moins 50 caractères'),
});

export type FreeReportContent = z.infer<typeof freeReportSchema>;

// Schéma pour les rapports premium (structure flexible)
export const premiumReportSchema = z.object({
  introduction: z.string().min(100, 'L\'introduction doit contenir au moins 100 caractères'),
  analyse: z.string().min(300, 'L\'analyse doit contenir au moins 300 caractères'),
  conseils: z.array(z.string()).min(3, 'Au moins 3 conseils requis'),
  conclusion: z.string().min(100, 'La conclusion doit contenir au moins 100 caractères'),
  // Champs optionnels selon le type
  predictions: z.array(z.string()).optional(),
  compatibilite: z.string().optional(),
  energies: z.array(z.string()).optional(),
});

export type PremiumReportContent = z.infer<typeof premiumReportSchema>;

// Schéma générique pour valider n'importe quel rapport
export const reportContentSchema = z.union([freeReportSchema, premiumReportSchema]);
