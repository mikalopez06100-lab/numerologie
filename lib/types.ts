// Types pour remplacer les enums Prisma (SQLite ne supporte pas les enums)

export type ReportType =
  | 'FREE'
  | 'YEAR'
  | 'MONTH'
  | 'NEXT_12_MONTHS'
  | 'LOVE'
  | 'MOTHER'
  | 'FATHER'
  | 'WORK'
  | 'MISSION'
  | 'DEEP_PROFILE';

export type ModuleType =
  | 'YEAR'
  | 'MONTH'
  | 'NEXT_12_MONTHS'
  | 'LOVE'
  | 'MOTHER'
  | 'FATHER'
  | 'WORK'
  | 'MISSION'
  | 'DEEP_PROFILE';
