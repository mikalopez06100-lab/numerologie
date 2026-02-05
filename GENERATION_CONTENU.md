# Génération de Contenu - Documentation

## Architecture

Le système de génération de contenu utilise OpenAI avec un fallback local automatique.

### Structure des fichiers

```
lib/ai/
├── schemas.ts          # Schémas Zod pour validation des rapports
├── prompts.ts          # Tous les prompts pour chaque type de rapport
├── openai.ts           # Client OpenAI + logique de génération
└── fallback.ts         # Génération locale si OpenAI indisponible
```

## Fonctionnement

### 1. Génération du rapport FREE

Lors de la création d'un profil (`POST /api/profile`), un rapport gratuit est automatiquement généré et sauvegardé.

**Schéma du rapport FREE :**
```typescript
{
  portrait: string;      // Portrait expressif (150-200 mots)
  forces: string[];     // 3-5 forces principales
  defis: string[];       // 2-4 défis/opportunités
  insight: string;       // Insight profond (150-200 mots)
  outro: string;         // Ouverture subtile (50-100 mots)
}
```

### 2. Génération des rapports premium

Lors du déblocage d'un module (`POST /api/unlock`), un rapport premium est généré automatiquement.

**Schéma du rapport premium :**
```typescript
{
  introduction: string;  // 100-150 mots
  analyse: string;       // 300+ mots (varie selon le type)
  conseils: string[];   // 3+ conseils
  conclusion: string;    // 100-150 mots
  // Champs optionnels selon le type
  predictions?: string[];
  compatibilite?: string;
  energies?: string[];
}
```

## Types de rapports disponibles

- **FREE** : Rapport gratuit (généré à la création du profil)
- **YEAR** : Année personnelle
- **MONTH** : Mois personnel
- **NEXT_12_MONTHS** : 12 prochains mois
- **LOVE** : Amour & Relations
- **MOTHER** : Relation maternelle
- **FATHER** : Relation paternelle
- **WORK** : Carrière & Travail
- **MISSION** : Mission de vie
- **DEEP_PROFILE** : Profil approfondi

## Configuration

### Avec OpenAI (recommandé)

1. Obtenez une clé API sur https://platform.openai.com/api-keys
2. Ajoutez-la dans `.env` :
   ```bash
   OPENAI_API_KEY="sk-..."
   ```
3. L'application utilisera GPT-4o-mini pour générer des rapports personnalisés

### Sans OpenAI (fallback)

Si `OPENAI_API_KEY` n'est pas configurée, l'application utilise automatiquement un système de fallback local qui génère des rapports structurés basés sur les calculs numérologiques.

## Validation

Tous les rapports générés sont validés avec Zod avant stockage :
- Si la validation échoue, le système utilise automatiquement le fallback
- Les erreurs sont loggées mais n'interrompent pas le processus

## Gestion des erreurs

- **OpenAI indisponible** : Fallback automatique
- **Validation JSON échouée** : Fallback automatique
- **Erreur réseau** : Fallback automatique
- **Timeout** : Fallback automatique

Le système garantit toujours la génération d'un rapport, même en cas de problème avec OpenAI.

## Prompts

Les prompts sont conçus pour :
- Recevoir les données du profil (nom, date, nombres numérologiques)
- Générer du contenu personnalisé et pertinent
- Retourner du JSON strict (sans markdown)
- Respecter les longueurs de texte demandées

## Performance

- **Avec OpenAI** : ~2-5 secondes par rapport
- **Fallback local** : <100ms par rapport

## Sécurité

- Aucune clé API n'est exposée dans le code
- Les clés sont stockées dans les variables d'environnement
- Validation stricte de tous les inputs
- Pas de données sensibles dans les logs
