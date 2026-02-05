# 🔗 Guide de Connexion Vercel + OpenAI

## Étape 1 : Préparer votre projet GitHub

### 1.1 Vérifier que votre code est sur GitHub

```bash
# Dans le dossier numerologie-app
cd ../numerologie-app

# Vérifier si c'est un repo git
git status
```

**Si ce n'est pas un repo Git :**

```bash
git init
git add .
git commit -m "Initial commit - Ready for Vercel"
```

### 1.2 Créer un repository GitHub (si pas encore fait)

1. Allez sur [github.com/new](https://github.com/new)
2. Nom du repo : `numerologie-app`
3. Visibilité : **Private** (recommandé) ou Public
4. Cliquez **"Create repository"**

### 1.3 Connecter votre projet local à GitHub

```bash
# Remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE_USERNAME/numerologie-app.git
git branch -M main
git push -u origin main
```

---

## Étape 2 : Connecter le projet à Vercel

### 2.1 Importer le projet dans Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New Project"** (ou le bouton "+ New")
3. Si demandé, **connectez votre compte GitHub** (autorisez Vercel)
4. Dans la liste des repositories, **trouvez `numerologie-app`**
5. Cliquez sur **"Import"**

### 2.2 Configurer le projet

Dans la page de configuration :

**Framework Preset :**
- ✅ Next.js (devrait être détecté automatiquement)

**⚠️ NE CLIQUEZ PAS ENCORE SUR "DEPLOY" !**

---

## Étape 3 : Obtenir votre clé API OpenAI

### 3.1 Accéder aux API Keys

1. Allez sur [platform.openai.com](https://platform.openai.com)
2. Connectez-vous à votre compte
3. Cliquez sur **"API Keys"** dans le menu (ou [platform.openai.com/api-keys](https://platform.openai.com/api-keys))

### 3.2 Créer une nouvelle clé

1. Cliquez sur **"+ Create new secret key"**
2. Donnez-lui un nom : `Numerologie App Production`
3. Cliquez sur **"Create secret key"**
4. **⚠️ IMPORTANT : COPIEZ LA CLÉ IMMÉDIATEMENT !**
   - Elle commence par `sk-`
   - Elle ne sera affichée qu'une seule fois
   - Exemple : `sk-proj-abc123def456ghi789...`

5. **Sauvegardez-la** dans un endroit sûr

---

## Étape 4 : Configurer les variables d'environnement dans Vercel

### 4.1 Accéder aux Environment Variables

**Dans la page de configuration du projet Vercel :**

1. Faites défiler jusqu'à **"Environment Variables"**
2. Cliquez sur **"Add"** ou le bouton **"+"**

### 4.2 Ajouter OPENAI_API_KEY

1. **Name** : `OPENAI_API_KEY`
2. **Value** : Collez votre clé API OpenAI (celle qui commence par `sk-`)
3. **Environments** : Cochez les 3 cases
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Cliquez sur **"Add"** ou **"Save"**

### 4.3 Ajouter les autres variables essentielles

**Ajoutez ces variables une par une :**

#### Variable 1 : NODE_ENV
- **Name** : `NODE_ENV`
- **Value** : `production`
- **Environments** : ✅ Production uniquement

#### Variable 2 : ADMIN_TOKEN
- **Name** : `ADMIN_TOKEN`
- **Value** : Générez un token fort
  - Utilisez [randomkeygen.com](https://randomkeygen.com/) → "Fort Knox Password"
  - Exemple : `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 3 : NEXT_PUBLIC_SITE_URL
- **Name** : `NEXT_PUBLIC_SITE_URL`
- **Value** : `https://votre-projet.vercel.app` (vous obtiendrez l'URL après le premier déploiement)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

**Note :** Vous pourrez mettre à jour cette URL après le premier déploiement.

---

## Étape 5 : Déployer !

### 5.1 Lancer le déploiement

1. Vérifiez que vous avez ajouté au minimum :
   - ✅ `OPENAI_API_KEY`
   - ✅ `NODE_ENV` = `production`
   - ✅ `ADMIN_TOKEN`

2. Cliquez sur **"Deploy"** en bas de la page

3. **Attendez 2-5 minutes** pendant que Vercel build et déploie

### 5.2 Vérifier le déploiement

Une fois terminé, vous verrez :
- ✅ **"Ready"** en vert
- Une URL : `https://votre-projet-xxx.vercel.app`

**Cliquez sur cette URL** pour voir votre site en ligne !

---

## Étape 6 : Mettre à jour NEXT_PUBLIC_SITE_URL

1. Dans Vercel → Votre projet → **Settings** → **Environment Variables**
2. Trouvez `NEXT_PUBLIC_SITE_URL`
3. Cliquez sur **"Edit"**
4. Remplacez la valeur par votre URL Vercel : `https://votre-projet-xxx.vercel.app`
5. Cliquez sur **"Save"**
6. Allez dans **Deployments** → Cliquez sur les **3 points** → **Redeploy**

---

## Étape 7 : Tester la connexion OpenAI

### 7.1 Tester manuellement

1. Allez sur votre site : `https://votre-projet-xxx.vercel.app`
2. Créez un profil (remplissez le formulaire)
3. Vérifiez que le rapport gratuit est généré
4. Si vous voyez du contenu personnalisé → ✅ OpenAI fonctionne !

### 7.2 Vérifier les logs

1. Dans Vercel → Votre projet → **Deployments**
2. Cliquez sur le dernier déploiement
3. Onglet **"Logs"**
4. Cherchez des erreurs liées à OpenAI

### 7.3 Vérifier l'usage OpenAI

1. Allez sur [platform.openai.com/usage](https://platform.openai.com/usage)
2. Vérifiez que des requêtes apparaissent
3. Vérifiez les coûts

---

## 🆘 Dépannage

### Problème : "OpenAI API key not found"

**Solution :**
1. Vérifiez que `OPENAI_API_KEY` est bien dans Vercel
2. Vérifiez que la clé commence par `sk-`
3. Redéployez après avoir ajouté la variable

### Problème : "Insufficient quota"

**Solution :**
1. Allez sur [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Vérifiez que vous avez des crédits
3. Ajoutez une méthode de paiement si nécessaire

---

## ✅ Checklist de Vérification

- [ ] Projet GitHub créé et code poussé
- [ ] Projet importé dans Vercel
- [ ] Clé API OpenAI créée et copiée
- [ ] `OPENAI_API_KEY` ajouté dans Vercel
- [ ] `NODE_ENV` = `production` ajouté
- [ ] `ADMIN_TOKEN` généré et ajouté
- [ ] Déploiement réussi
- [ ] Site accessible
- [ ] Test de création de profil fonctionne
- [ ] Rapport généré avec contenu OpenAI

---

**🎉 Félicitations ! Votre application est connectée à OpenAI !**
