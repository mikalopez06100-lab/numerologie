# Arborescence du Projet

```
numerologie-app/
├── app/                          # App Router Next.js
│   ├── api/                      # Routes API
│   │   └── profile/              # Endpoints profil
│   │       ├── [id]/             # Route dynamique
│   │       │   └── route.ts      # GET /api/profile/[id]
│   │       └── route.ts           # POST /api/profile
│   ├── globals.css                # Styles globaux Tailwind
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Page d'accueil
│
├── lib/                           # Utilitaires et logique métier
│   ├── numerology/                # Calculs numérologiques
│   │   ├── table.ts               # Table pythagoricienne et conversions
│   │   ├── calculations.ts       # Fonctions de calcul (lifePath, expression, etc.)
│   │   └── index.ts               # Exports publics
│   ├── prisma.ts                  # Client Prisma (singleton)
│   └── validations.ts             # Schémas Zod pour validation
│
├── prisma/
│   └── schema.prisma              # Schéma de base de données (Profile, Numerology, Report, Unlock)
│
├── .eslintrc.json                 # Configuration ESLint
├── .gitignore                     # Fichiers ignorés par Git
├── env.example                    # Exemple de fichier d'environnement
├── next.config.ts                 # Configuration Next.js
├── next-env.d.ts                  # Types Next.js
├── package.json                   # Dépendances et scripts
├── postcss.config.mjs             # Configuration PostCSS
├── README.md                       # Documentation principale
├── tailwind.config.ts             # Configuration Tailwind CSS
└── tsconfig.json                  # Configuration TypeScript
```

## Fichiers Clés

### Configuration
- `package.json` - Dépendances et scripts npm
- `tsconfig.json` - Configuration TypeScript stricte
- `next.config.ts` - Configuration Next.js
- `tailwind.config.ts` - Configuration Tailwind CSS
- `prisma/schema.prisma` - Schéma de base de données

### API Routes
- `app/api/profile/route.ts` - POST pour créer un profil
- `app/api/profile/[id]/route.ts` - GET pour récupérer un profil

### Logique Métier
- `lib/numerology/table.ts` - Table pythagoricienne
- `lib/numerology/calculations.ts` - Calculs numérologiques
- `lib/validations.ts` - Schémas de validation Zod
- `lib/prisma.ts` - Client Prisma

### Pages
- `app/page.tsx` - Page d'accueil
- `app/layout.tsx` - Layout principal
- `app/globals.css` - Styles globaux
