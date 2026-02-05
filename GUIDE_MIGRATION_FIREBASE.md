# 🔥 Guide de Migration vers Firebase

## ✅ Étape 1 : Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur **"Ajouter un projet"**
3. Entrez un nom (ex: `numerologie-app`)
4. **Décochez** Google Analytics (optionnel)
5. Cliquez sur **"Créer le projet"**

## ✅ Étape 2 : Enregistrer l'application web

1. Dans le tableau de bord Firebase, cliquez sur l'icône **Web** (`</>`)
2. Entrez un nom : **`Numerologie App`**
3. **Ne cochez PAS** "Also set up Firebase Hosting"
4. Cliquez sur **"Enregistrer l'application"**
5. **Copiez la configuration** qui apparaît (vous en aurez besoin)

## ✅ Étape 3 : Activer Firestore

1. Dans Firebase Console, allez dans **Firestore Database**
2. Cliquez sur **"Créer une base de données"**
3. Choisissez **"Démarrer en mode test"** (pour commencer)
4. Choisissez une région (ex: `europe-west`)
5. Cliquez sur **"Activer"**

## ✅ Étape 4 : Configurer les règles de sécurité

1. Dans Firestore, allez dans l'onglet **"Règles"**
2. Remplacez le contenu par le fichier `firestore.rules` du projet
3. Cliquez sur **"Publier"**

**Note** : Les règles actuelles permettent la lecture publique mais l'écriture uniquement côté serveur (via vos API routes).

## ✅ Étape 5 : Configurer les variables d'environnement

### Localement (`.env.local`)

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_FIREBASE_API_KEY="votre_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="votre_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="votre_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="votre_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="votre_messaging_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="votre_app_id"

OPENAI_API_KEY="votre_clé_openai"
ADMIN_TOKEN="votre_token_secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
```

### Sur Vercel

1. Allez dans votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez toutes les variables ci-dessus (sauf `NODE_ENV` qui est automatique)

## ✅ Étape 6 : Tester localement

```bash
npm run dev
```

Testez :
- Créer un profil
- Voir un profil
- Débloquer un module
- Vérifier dans Firebase Console que les données sont créées

## ✅ Étape 7 : Déployer

```bash
git add .
git commit -m "Migration vers Firebase"
git push origin main
```

Vercel redéploiera automatiquement avec les nouvelles variables d'environnement.

## 📋 Collections Firestore créées automatiquement

Les collections suivantes seront créées automatiquement lors de la première utilisation :

- `profiles` - Profils utilisateurs
- `numerologies` - Calculs numérologiques
- `reports` - Rapports générés
- `unlocks` - Modules débloqués
- `event_logs` - Logs d'événements

## 🔒 Sécurité

- **Lecture** : Publique (pour l'API)
- **Écriture** : Uniquement côté serveur (via vos API routes)
- Les règles sont dans `firestore.rules`

## 🆘 Dépannage

### Erreur "Firebase not initialized"
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que les noms des variables commencent par `NEXT_PUBLIC_`

### Erreur "Permission denied"
- Vérifiez que les règles Firestore sont bien déployées
- Vérifiez que vous êtes en mode "test" ou que les règles sont correctes

### Les données n'apparaissent pas
- Vérifiez dans Firebase Console > Firestore Database
- Vérifiez que les collections sont créées
- Vérifiez les logs de l'application
