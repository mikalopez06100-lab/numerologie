# ⚡ Étapes Rapides - Connexion Vercel + OpenAI

## En 10 Minutes

### ✅ Étape 1 : GitHub (2 min)

```bash
cd ../numerologie-app
git init
git add .
git commit -m "Ready for Vercel"

# Créer repo sur github.com/new
git remote add origin https://github.com/VOTRE_USERNAME/numerologie-app.git
git push -u origin main
```

### ✅ Étape 2 : Vercel (3 min)

1. [vercel.com](https://vercel.com) → **Add New Project**
2. Sélectionner **numerologie-app** (GitHub)
3. **NE PAS DÉPLOYER ENCORE** ⚠️

### ✅ Étape 3 : OpenAI (2 min)

1. [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Create new secret key**
3. **COPIER LA CLÉ** (commence par `sk-`)

### ✅ Étape 4 : Variables Vercel (2 min)

Dans Vercel → **Environment Variables** → Ajouter :

```
OPENAI_API_KEY = sk-... (votre clé)
NODE_ENV = production
ADMIN_TOKEN = générez-un-token-fort
```

**Pour ADMIN_TOKEN** : [randomkeygen.com](https://randomkeygen.com/)

### ✅ Étape 5 : Déployer (1 min)

1. Cliquer **"Deploy"**
2. Attendre 2-5 min
3. ✅ Site en ligne !

---

## Test Rapide

1. Aller sur votre URL Vercel
2. Créer un profil
3. Vérifier que le rapport est généré
4. ✅ Si contenu personnalisé → OpenAI fonctionne !

---

## Vérifier OpenAI

[platform.openai.com/usage](https://platform.openai.com/usage) → Voir les requêtes

---

**Besoin de détails ?** → Voir `CONNEXION_VERCEL_OPENAI.md`
