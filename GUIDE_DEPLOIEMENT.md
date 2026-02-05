# Guide de Déploiement Complet

## 📋 Table des Matières

1. [Déploiement sur Vercel](#1-déploiement-sur-vercel)
2. [Configuration du Nom de Domaine](#2-configuration-du-nom-de-domaine)
3. [Configuration OpenAI](#3-configuration-openai)
4. [Configuration Base de Données](#4-configuration-base-de-données)
5. [Vérifications Post-Déploiement](#5-vérifications-post-déploiement)

---

## 1. Déploiement sur Vercel

### Étape 1.1 : Préparer le projet

```bash
cd numerologie-app

# Vérifier que tout fonctionne localement
npm install
npm run build
```

### Étape 1.2 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec **GitHub** (recommandé) ou email

### Étape 1.3 : Connecter votre projet GitHub

**Option A : Projet déjà sur GitHub**

1. Dans Vercel, cliquez sur **"Add New Project"**
2. Sélectionnez votre repository `numerologie-app`
3. Vercel détecte automatiquement Next.js

**Option B : Créer un nouveau repository GitHub**

```bash
# Dans le dossier numerologie-app
git init
git add .
git commit -m "Initial commit"

# Créer un repo sur GitHub, puis :
git remote add origin https://github.com/votre-username/numerologie-app.git
git branch -M main
git push -u origin main
```

Puis suivez l'Option A.

### Étape 1.4 : Configurer le projet Vercel

Dans l'interface Vercel :

1. **Framework Preset** : Next.js (détecté automatiquement)
2. **Root Directory** : `./` (laisser par défaut)
3. **Build Command** : `npm run build` (par défaut)
4. **Output Directory** : `.next` (par défaut)
5. **Install Command** : `npm install` (par défaut)

**⚠️ IMPORTANT : Ne cliquez pas encore sur "Deploy" !**

---

## 2. Configuration du Nom de Domaine

### Étape 2.1 : Acheter un nom de domaine (si nécessaire)

**Recommandations de registrars :**
- [Namecheap](https://www.namecheap.com) - Bon marché, interface simple
- [Google Domains](https://domains.google) - Intégration facile
- [OVH](https://www.ovh.com) - Pour la France
- [Gandi](https://www.gandi.net) - Éthique et fiable

**Exemple :** `numerologie-premium.fr` ou `mon-numerologie.com`

### Étape 2.2 : Ajouter le domaine dans Vercel

1. Dans votre projet Vercel, allez dans **Settings** → **Domains**
2. Cliquez sur **"Add Domain"**
3. Entrez votre nom de domaine (ex: `numerologie-premium.fr`)
4. Vercel vous donne des instructions DNS

### Étape 2.3 : Configurer les DNS

**Option A : Utiliser les DNS de Vercel (Recommandé)**

1. Dans votre registrar (Namecheap, OVH, etc.), allez dans les paramètres DNS
2. Changez les **Nameservers** vers ceux fournis par Vercel :
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

**Option B : Utiliser les DNS de votre registrar**

Ajoutez ces enregistrements DNS dans votre registrar :

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**Pour Vercel, vous recevrez les valeurs exactes à utiliser.**

### Étape 2.4 : Attendre la propagation DNS

- **Temps moyen** : 5 minutes à 48 heures
- **Vérifier** : Utilisez [whatsmydns.net](https://www.whatsmydns.net)
- **Vercel** : Affichera "Valid Configuration" quand c'est prêt

### Étape 2.5 : Configurer HTTPS (Automatique)

Vercel configure automatiquement SSL/HTTPS via Let's Encrypt. Aucune action requise.

---

## 3. Configuration OpenAI

### Étape 3.1 : Créer un compte OpenAI

1. Allez sur [platform.openai.com](https://platform.openai.com)
2. Cliquez sur **"Sign Up"**
3. Créez un compte (email + mot de passe)
4. Vérifiez votre email

### Étape 3.2 : Ajouter une méthode de paiement

1. Dans votre compte OpenAI, allez dans **Settings** → **Billing**
2. Cliquez sur **"Add payment method"**
3. Ajoutez une carte bancaire
4. **Important** : Configurez une limite de dépenses pour éviter les surprises

### Étape 3.3 : Créer une clé API

1. Allez dans **API Keys** : [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Cliquez sur **"Create new secret key"**
3. Donnez-lui un nom (ex: "Numerologie App Production")
4. **⚠️ COPIEZ LA CLÉ IMMÉDIATEMENT** - Elle ne sera affichée qu'une seule fois !
5. Stockez-la dans un gestionnaire de mots de passe (1Password, LastPass, etc.)

**Exemple de clé :** `sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

### Étape 3.4 : Ajouter la clé dans Vercel

1. Dans votre projet Vercel, allez dans **Settings** → **Environment Variables**
2. Cliquez sur **"Add New"**
3. Ajoutez :
   - **Key** : `OPENAI_API_KEY`
   - **Value** : Votre clé API (commence par `sk-`)
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development
4. Cliquez sur **"Save"**

### Étape 3.5 : Vérifier les coûts OpenAI

**Modèle utilisé** : `gpt-4o-mini` (le moins cher)

**Coûts approximatifs** :
- Rapport FREE : ~$0.001-0.002 par génération
- Rapport Premium : ~$0.002-0.005 par génération
- **1000 rapports** ≈ $2-5

**Conseil** : Configurez une alerte de budget dans OpenAI.

---

## 4. Configuration Base de Données

### Étape 4.1 : Choisir un hébergeur Postgres

**Options recommandées :**

1. **Vercel Postgres** (Intégré, facile)
   - Gratuit jusqu'à 256 MB
   - Parfait pour commencer

2. **Supabase** (Gratuit, généreux)
   - 500 MB gratuits
   - Interface excellente
   - [supabase.com](https://supabase.com)

3. **Railway** (Simple, moderne)
   - $5/mois pour commencer
   - [railway.app](https://railway.app)

4. **Neon** (Serverless Postgres)
   - Gratuit jusqu'à 0.5 GB
   - [neon.tech](https://neon.tech)

### Étape 4.2 : Créer la base de données (Exemple avec Supabase)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez :
   - **Database URL** (format: `postgresql://postgres:[password]@[host]:5432/postgres`)
   - **Password** (vous l'avez créée lors de la création du projet)

### Étape 4.3 : Migrer le schéma Prisma

**Option A : Migration locale puis push**

```bash
# Modifier prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Générer le client
npm run db:generate

# Créer la migration
npm run db:migrate dev --name init

# Push vers la base de données
npx prisma db push
```

**Option B : Push direct (pour MVP)**

```bash
# Modifier prisma/schema.prisma (changer provider en postgresql)
npx prisma db push
```

### Étape 4.4 : Ajouter DATABASE_URL dans Vercel

1. Dans Vercel → **Settings** → **Environment Variables**
2. Ajoutez :
   - **Key** : `DATABASE_URL`
   - **Value** : Votre URL Postgres (ex: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`)
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development
3. Cliquez sur **"Save"**

---

## 5. Configuration Variables d'Environnement Complètes

Dans Vercel → **Settings** → **Environment Variables**, ajoutez :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `DATABASE_URL` | `postgresql://...` | URL de votre base Postgres |
| `OPENAI_API_KEY` | `sk-...` | Clé API OpenAI |
| `ADMIN_TOKEN` | `votre-token-secret-32-caracteres` | Token pour accès stats (générez un token fort) |
| `NEXT_PUBLIC_SITE_URL` | `https://votre-domaine.com` | URL de votre site |
| `NODE_ENV` | `production` | Environnement |

**Pour générer un ADMIN_TOKEN fort :**
```bash
# Sur Linux/Mac
openssl rand -hex 32

# Ou utilisez un générateur en ligne
# https://randomkeygen.com/
```

---

## 6. Déploiement Final

### Étape 6.1 : Déployer

1. Dans Vercel, cliquez sur **"Deploy"**
2. Attendez la fin du build (2-5 minutes)
3. Votre site est en ligne ! 🎉

### Étape 6.2 : Redéployer après changements

Vercel redéploie automatiquement à chaque push sur GitHub.

**Ou manuellement :**
- Dans Vercel → **Deployments** → **Redeploy**

---

## 7. Vérifications Post-Déploiement

### ✅ Checklist

- [ ] Site accessible sur votre domaine
- [ ] HTTPS fonctionne (cadenas vert)
- [ ] Formulaire de création de profil fonctionne
- [ ] Rapport gratuit généré
- [ ] Déblocage de module fonctionne
- [ ] OpenAI génère du contenu (vérifier dans les logs)
- [ ] Base de données accessible
- [ ] Route admin stats accessible avec token
- [ ] Rate limiting actif
- [ ] Headers sécurité présents

### Tester les fonctionnalités

1. **Créer un profil** : Vérifier que tout fonctionne
2. **Vérifier les logs Vercel** : Settings → Logs
3. **Tester OpenAI** : Vérifier que les rapports sont générés
4. **Tester les stats** :
   ```bash
   curl -H "x-admin-token: votre-token" \
     https://votre-domaine.com/api/admin/stats
   ```

### Vérifier les Headers Sécurité

```bash
curl -I https://votre-domaine.com
```

Vous devriez voir :
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## 8. Monitoring et Maintenance

### Logs Vercel

- **Accès** : Projet → **Deployments** → Cliquez sur un déploiement → **Logs**
- **Fonctionnalités** : Recherche, filtres, export

### Monitoring OpenAI

- **Dashboard** : [platform.openai.com/usage](https://platform.openai.com/usage)
- **Alertes** : Configurez des limites de budget
- **Métriques** : Requêtes, tokens, coûts

### Monitoring Base de Données

- **Supabase** : Dashboard intégré avec métriques
- **Vercel Postgres** : Dashboard dans Vercel
- **Autres** : Utilisez les outils de votre hébergeur

### Sauvegardes

- **Base de données** : Configurez des sauvegardes automatiques
- **Code** : GitHub = sauvegarde automatique
- **Variables d'environnement** : Sauvegardez-les dans un gestionnaire de mots de passe

---

## 9. Optimisations Futures

### Performance

- [ ] Activer le cache Vercel
- [ ] Optimiser les images (next/image)
- [ ] Configurer CDN pour assets statiques

### Sécurité

- [ ] Migrer rate limiting vers Redis (si multi-instances)
- [ ] Ajouter monitoring (Sentry)
- [ ] Configurer WAF (Web Application Firewall)

### Analytics

- [ ] Ajouter Google Analytics
- [ ] Configurer des événements personnalisés
- [ ] Dashboard de métriques avancées

---

## 🆘 Dépannage

### Problème : Domaine ne fonctionne pas

1. Vérifiez la propagation DNS : [whatsmydns.net](https://www.whatsmydns.net)
2. Vérifiez les DNS dans Vercel : Settings → Domains
3. Attendez 24-48h maximum

### Problème : OpenAI ne fonctionne pas

1. Vérifiez la clé API dans Vercel
2. Vérifiez les crédits OpenAI
3. Vérifiez les logs Vercel pour les erreurs

### Problème : Base de données inaccessible

1. Vérifiez DATABASE_URL dans Vercel
2. Vérifiez que la base accepte les connexions externes
3. Vérifiez les credentials

### Problème : Build échoue

1. Vérifiez les logs de build dans Vercel
2. Testez localement : `npm run build`
3. Vérifiez que toutes les dépendances sont dans `package.json`

---

## 📞 Support

- **Vercel** : [vercel.com/support](https://vercel.com/support)
- **OpenAI** : [help.openai.com](https://help.openai.com)
- **Documentation** : Voir README.md et autres fichiers .md

---

**🎉 Félicitations ! Votre application est maintenant en ligne !**
