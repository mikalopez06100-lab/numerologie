# Arborescence UI - Application Numérologie

## Structure des Composants

```
components/
├── ui/                           # Composants UI de base
│   ├── Button.tsx                # Bouton avec variants (primary, secondary, outline)
│   ├── Card.tsx                  # Carte avec variants (default, glass)
│   ├── Input.tsx                 # Input avec label et gestion d'erreur
│   └── SectionTitle.tsx          # Titre de section avec sous-titre
│
├── BlurredPremiumCard.tsx        # Carte premium avec effet flou pour contenu non débloqué
└── ModuleGrid.tsx                # Grille de modules premium
```

## Pages

```
app/
├── page.tsx                      # Landing page (/) avec formulaire
├── analyse/
│   └── [id]/
│       └── page.tsx              # Page d'analyse avec modules
└── api/
    └── unlock/
        └── route.ts              # POST /api/unlock (déblocage de modules)
```

## Design System

### Couleurs
- **Fond principal** : `#0D1B2A` (bleu nuit)
- **Cartes** : `#FAF7F2` (blanc cassé)
- **Accent principal** : `#4F3AA2` (violet)
- **Accent or** : `#DCC48E`

### Typographie
- **Titres** : Playfair Display (via `next/font`)
- **Texte** : Inter (via `next/font`)

### Effets
- **Glassmorphism** : Classes `.glass` et `.glass-strong` dans `globals.css`
- **Backdrop blur** : Utilisé pour les overlays premium

## Fonctionnalités

### Landing Page (/)
- Formulaire de création de profil
- Validation côté client
- Appel API POST /api/profile
- Redirection vers /analyse/[profileId]

### Page Analyse (/analyse/[id])
- Chargement du profil via GET /api/profile/[id]
- Affichage des nombres fondamentaux (lifePath, expression, soulUrge, personality)
- Section rapport gratuit
- Grille de modules premium avec :
  - Effet flou pour contenu non débloqué
  - Bouton de déblocage
  - États de chargement

### API Unlock
- POST /api/unlock
- Validation avec Zod
- Création/mise à jour d'unlock dans la base de données

## États Gérés

- **Loading** : Spinners et états de chargement
- **Error** : Messages d'erreur sobres et clairs
- **Success** : Redirections et mises à jour automatiques

## Responsive

- Mobile-first
- Breakpoints Tailwind (md, lg)
- Grille adaptative pour les modules (1 col mobile, 2 cols tablette, 3 cols desktop)
