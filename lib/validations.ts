import { z } from 'zod';

export const createProfileSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  birthPlace: z.string().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
