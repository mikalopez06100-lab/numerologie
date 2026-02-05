# Application de Numérologie

Application web Next.js (App Router) TypeScript pour une application de numérologie premium.

## 🚀 Déploiement Rapide

**Pour déployer rapidement, consultez :**
- **[QUICK_START_DEPLOY.md](./QUICK_START_DEPLOY.md)** - Guide rapide (5-15 min)
- **[GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md)** - Guide complet et détaillé

**Résumé :**
1. Push le code sur GitHub
2. Connecter à Vercel
3. Configurer les variables d'environnement
4. Déployer !

## Stack Technique

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** pour le styling
- **Prisma** + SQLite (MVP local), migrable vers Postgres
- **Zod** pour la validation des données
- **OpenAI** (optionnel) pour la génération de contenu avec fallback local
- Pas d'authentification en V1 (profil anonyme)

## Structure du Projet

```
numerologie-app/
├── app/                    # App Router Next.js
│   ├── api/               # Routes API
│   │   └── profile/       # Endpoints profil
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── lib/                   # Utilitaires et logique métier
│   ├── numerology/        # Calculs numérologiques
│   │   ├── table.ts       # Table pythagoricienne
│   │   ├── calculations.ts # Fonctions de calcul
│   │   └── index.ts       # Exports
│   ├── prisma.ts          # Client Prisma
│   └── validations.ts     # Schémas Zod
├── prisma/
│   └── schema.prisma      # Schéma de base de données
└── public/                # Assets statiques
```

## Installation

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configurer l'environnement :**
   ```bash
   cp env.example .env
   ```
   Le fichier `.env` contient la configuration par défaut pour SQLite.
   
   **Optionnel :** Pour activer la génération de contenu via OpenAI, ajoutez votre clé API :
   ```bash
   OPENAI_API_KEY="sk-..."
   ```
   Si la clé n'est pas fournie, l'application utilisera un système de fallback local qui génère des rapports structurés.

3. **Initialiser la base de données :**
   ```bash
   npm run db:migrate
   ```
   Cette commande génère le client Prisma et crée la base de données SQLite.

4. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Modèles de Données

### Profile
- `id` (cuid)
- `firstName`, `lastName`
- `birthDate` (format: YYYY-MM-DD)
- `birthPlace` (optionnel)
- `createdAt`

### Numerology
- `id` (cuid)
- `profileId` (unique, relation avec Profile)
- `lifePath` (chemin de vie)
- `expression` (nombre d'expression)
- `soulUrge` (aspiration de l'âme)
- `personality` (personnalité, optionnel)
- `createdAt`

### Report
- `id` (cuid)
- `profileId` (relation avec Profile)
- `type` (enum: FREE, YEAR, MONTH, NEXT_12_MONTHS, LOVE, MOTHER, FATHER, WORK, MISSION, DEEP_PROFILE)
- `contentJson` (JSON)
- `createdAt`

### Unlock
- `id` (cuid)
- `profileId` (relation avec Profile)
- `moduleType` (enum: YEAR, MONTH, NEXT_12_MONTHS, LOVE, MOTHER, FATHER, WORK, MISSION, DEEP_PROFILE)
- `isUnlocked` (boolean)
- `unlockedAt` (DateTime optionnel)

## API Endpoints

### POST /api/profile
Crée un nouveau profil, calcule automatiquement les nombres numérologiques et génère un rapport gratuit (FREE).

**Body :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "birthDate": "1990-05-15",
  "birthPlace": "Paris" // optionnel
}
```

**Réponse (201) :**
```json
{
  "profileId": "clx...",
  "numerology": {
    "id": "clx...",
    "lifePath": 5,
    "expression": 7,
    "soulUrge": 3,
    "personality": 4
  }
}
```

### GET /api/profile/[id]
Récupère un profil avec sa numérologie, ses unlocks et ses rapports.

### POST /api/unlock
Débloque un module premium et génère automatiquement le rapport correspondant.

**Body :**
```json
{
  "profileId": "clx...",
  "moduleType": "YEAR"
}
```

**Réponse (201) :**
```json
{
  "unlock": { ... },
  "message": "Module débloqué et rapport généré avec succès"
}
```

**Types de modules disponibles :**
- `YEAR` - Année personnelle
- `MONTH` - Mois personnel
- `NEXT_12_MONTHS` - 12 prochains mois
- `LOVE` - Amour & Relations
- `MOTHER` - Relation maternelle
- `FATHER` - Relation paternelle
- `WORK` - Carrière & Travail
- `MISSION` - Mission de vie
- `DEEP_PROFILE` - Profil approfondi

**Réponse (200) :**
```json
{
  "id": "clx...",
  "firstName": "Jean",
  "lastName": "Dupont",
  "birthDate": "1990-05-15",
  "birthPlace": "Paris",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "numerology": { ... },
  "unlocks": [ ... ],
  "reports": [ ... ]
}
```

## Calculs Numérologiques

Les calculs utilisent la table pythagoricienne :
- A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
- Puis cycle : J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9, S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8

**Fonctionnalités :**
- Gestion des accents (normalisation)
- Ignore les espaces et traits d'union
- Réduction à un chiffre (1-9)
- Support optionnel des nombres maîtres (11, 22, 33)

## Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build de production
- `npm run start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run db:migrate` - Crée une migration Prisma
- `npm run db:generate` - Génère le client Prisma
- `npm run db:studio` - Ouvre Prisma Studio (interface graphique)

## Migration vers Postgres

Pour migrer vers Postgres en production, modifiez `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Puis mettez à jour votre `.env` avec l'URL de connexion Postgres et exécutez :
```bash
npm run db:migrate
```

## Génération de Contenu

L'application génère automatiquement des rapports numérologiques personnalisés :

- **Rapport gratuit (FREE)** : Généré automatiquement lors de la création d'un profil
- **Rapports premium** : Générés lors du déblocage d'un module

### Avec OpenAI (recommandé)

Si `OPENAI_API_KEY` est configurée, l'application utilise GPT-4o-mini pour générer des rapports personnalisés et détaillés.

### Sans OpenAI (fallback)

Si la clé API n'est pas fournie, l'application utilise un système de fallback local qui génère des rapports structurés basés sur les calculs numérologiques.

## Production

### Variables d'environnement requises

```bash
# Base de données (Postgres recommandé en production)
DATABASE_URL="postgresql://user:password@localhost:5432/numerologie"

# OpenAI (optionnel mais recommandé)
OPENAI_API_KEY="sk-..."

# Sécurité
ADMIN_TOKEN="token-secret-pour-stats"
NODE_ENV="production"

# SEO
NEXT_PUBLIC_SITE_URL="https://votre-domaine.com"
```

### Checklist de déploiement

1. **Base de données**
   - Migrer vers Postgres (modifier `prisma/schema.prisma`)
   - Exécuter `npm run db:migrate`
   - Vérifier les connexions

2. **Sécurité**
   - Configurer `ADMIN_TOKEN` (token fort et unique)
   - Vérifier les headers de sécurité (middleware.ts)
   - Activer HTTPS
   - Configurer le rate limiting (actuellement en mémoire, considérer Redis pour production)

3. **Performance**
   - Activer le cache Next.js
   - Configurer CDN pour assets statiques
   - Monitorer les performances API

4. **Monitoring**
   - Configurer les logs d'erreurs
   - Monitorer les événements via `/api/admin/stats`
   - Surveiller les erreurs OpenAI

5. **SEO**
   - Vérifier les metadata sur toutes les pages
   - Configurer `NEXT_PUBLIC_SITE_URL`
   - Soumettre le sitemap

### Accès aux statistiques

```bash
# Avec token dans header
curl -H "x-admin-token: votre-token" https://votre-domaine.com/api/admin/stats

# Ou avec query parameter
curl https://votre-domaine.com/api/admin/stats?token=votre-token
```

## Notes

- TypeScript strict activé
- Gestion d'erreurs cohérente avec réponses JSON
- Validation des rapports avec Zod avant stockage
- Code organisé et maintenable
- Fallback automatique si OpenAI n'est pas disponible
- Rate limiting en mémoire (considérer Redis pour production)
- Tracking des événements pour analytics
