# 🚀 Guide Rapide de Déploiement

## En 5 Minutes

### 1. Préparer le code

```bash
cd numerologie-app
git init
git add .
git commit -m "Ready to deploy"
```

### 2. Créer un repo GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. Créez un repo `numerologie-app`
3. Suivez les instructions pour push :

```bash
git remote add origin https://github.com/votre-username/numerologie-app.git
git branch -M main
git push -u origin main
```

### 3. Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com) → **Sign Up** (avec GitHub)
2. **Add New Project** → Sélectionnez votre repo
3. **Configure Project** :
   - Framework: Next.js (auto-détecté)
   - Root Directory: `./`
4. **Environment Variables** → Ajoutez (pour l'instant, on les ajoutera après) :
   - `NODE_ENV` = `production`
5. Cliquez **Deploy**

✅ Votre site est en ligne sur `votre-projet.vercel.app` !

---

## Configuration Complète (15 minutes)

### Étape 1 : Base de Données (Supabase - Gratuit)

1. [supabase.com](https://supabase.com) → **New Project**
2. Notez la **Database URL** (dans Settings → Database)
3. Dans Vercel → **Settings** → **Environment Variables** :
   - `DATABASE_URL` = votre URL Supabase

### Étape 2 : Migrer la base

```bash
# Modifier prisma/schema.prisma
# Changer provider en "postgresql"

# Localement
npx prisma db push
```

### Étape 3 : OpenAI

1. [platform.openai.com](https://platform.openai.com) → **Sign Up**
2. **API Keys** → **Create new secret key**
3. Dans Vercel → **Environment Variables** :
   - `OPENAI_API_KEY` = votre clé

### Étape 4 : Variables restantes

Dans Vercel → **Environment Variables** :

```bash
ADMIN_TOKEN=generez-un-token-fort-32-caracteres
NEXT_PUBLIC_SITE_URL=https://votre-projet.vercel.app
NODE_ENV=production
```

### Étape 5 : Redéployer

Dans Vercel → **Deployments** → **Redeploy**

---

## Ajouter un Domaine Personnalisé

### Option 1 : Acheter un domaine

1. [Namecheap](https://www.namecheap.com) ou autre registrar
2. Achetez votre domaine (ex: `numerologie.fr`)

### Option 2 : Configurer dans Vercel

1. Vercel → **Settings** → **Domains** → **Add Domain**
2. Entrez votre domaine
3. Suivez les instructions DNS

### Option 3 : Configurer les DNS

**Si vous utilisez les DNS de votre registrar :**

Ajoutez ces enregistrements (Vercel vous donnera les valeurs exactes) :

```
Type: A
Name: @
Value: [IP fournie par Vercel]

Type: CNAME
Name: www
Value: [CNAME fourni par Vercel]
```

**Si vous utilisez les DNS de Vercel (plus simple) :**

Changez les nameservers dans votre registrar vers ceux fournis par Vercel.

⏱️ Attendez 5 minutes à 48h pour la propagation.

---

## Vérification

### Test rapide

1. ✅ Site accessible
2. ✅ Créer un profil → Fonctionne ?
3. ✅ Rapport généré → Contenu visible ?
4. ✅ Débloquer un module → Fonctionne ?

### Vérifier les logs

Vercel → **Deployments** → Cliquez sur le dernier → **Logs**

### Vérifier OpenAI

[platform.openai.com/usage](https://platform.openai.com/usage) → Vérifiez les requêtes

---

## Coûts Estimés

| Service | Coût |
|---------|------|
| **Vercel** | Gratuit (Hobby) ou $20/mois (Pro) |
| **Supabase** | Gratuit (500 MB) ou $25/mois |
| **OpenAI** | ~$0.002-0.005 par rapport |
| **Domaine** | ~$10-15/an |

**Total MVP** : ~$0-5/mois + coûts OpenAI à l'usage

---

## 🆘 Problèmes Courants

### "Build failed"

→ Vérifiez les logs dans Vercel
→ Testez localement : `npm run build`

### "Database connection error"

→ Vérifiez DATABASE_URL dans Vercel
→ Vérifiez que la base accepte les connexions externes

### "OpenAI error"

→ Vérifiez OPENAI_API_KEY
→ Vérifiez les crédits sur OpenAI

### "Domain not working"

→ Vérifiez la propagation : [whatsmydns.net](https://www.whatsmydns.net)
→ Attendez jusqu'à 48h

---

**Besoin d'aide ?** Consultez `GUIDE_DEPLOIEMENT.md` pour plus de détails.
