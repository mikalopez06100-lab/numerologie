# 🔧 Configuration des Variables d'Environnement Vercel

## 📋 Étapes pour ajouter les variables dans Vercel

1. **Allez sur Vercel** : https://vercel.com
2. **Sélectionnez votre projet** `numerologie`
3. **Allez dans Settings** → **Environment Variables**
4. **Ajoutez chaque variable** une par une (voir ci-dessous)

## 🔑 Variables à ajouter

### Variables Firebase (OBLIGATOIRES)

Ajoutez ces 6 variables avec les valeurs de votre projet Firebase :

| Variable | Exemple de valeur | Où la trouver |
|----------|-------------------|---------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSy...` | Firebase Console > Project Settings > Your apps |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `numerologie-app.firebaseapp.com` | Firebase Console > Project Settings > Your apps |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `numerologie-app` | Firebase Console > Project Settings > General |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `numerologie-app.appspot.com` | Firebase Console > Project Settings > Your apps |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase Console > Project Settings > Your apps |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456789:web:abcdef` | Firebase Console > Project Settings > Your apps |

### Variables existantes (à vérifier/mettre à jour)

| Variable | Valeur actuelle | Action |
|----------|----------------|--------|
| `OPENAI_API_KEY` | `sk-proj-...` | À configurer avec votre clé OpenAI |
| `ADMIN_TOKEN` | ? | Vérifier/ajouter un token secret |
| `NEXT_PUBLIC_SITE_URL` | ? | Mettre l'URL Vercel (ex: `https://numerologie.vercel.app`) |

## 📝 Instructions détaillées

### Pour chaque variable Firebase :

1. Cliquez sur **"Add New"**
2. **Key** : Entrez le nom de la variable (ex: `NEXT_PUBLIC_FIREBASE_API_KEY`)
3. **Value** : Entrez la valeur depuis Firebase Console
4. **Environments** : Cochez **Production**, **Preview**, et **Development**
5. Cliquez sur **"Save"**

### Où trouver les valeurs Firebase :

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Cliquez sur l'icône ⚙️ (Settings) → **Project settings**
4. Allez dans l'onglet **"Your apps"**
5. Cliquez sur l'icône **Web** (`</>`) si vous avez plusieurs apps
6. Vous verrez la configuration qui ressemble à :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "...",             // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "...",              // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "...",          // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "...",      // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "..."                   // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

## ✅ Après avoir ajouté les variables

1. **Redéployez** votre application :
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** du dernier déploiement
   - Cliquez sur **"Redeploy"**

OU

2. **Faites un commit vide** pour déclencher un nouveau déploiement :
   ```bash
   git commit --allow-empty -m "Trigger redeploy with Firebase env vars"
   git push origin main
   ```

## 🧪 Vérification

Après le redéploiement, testez :
- Créer un profil → Vérifier dans Firebase Console que les données apparaissent
- Voir un profil → Vérifier que les données sont récupérées
- Débloquer un module → Vérifier que l'unlock est créé

## 🆘 Problèmes courants

### "Firebase not initialized"
- Vérifiez que toutes les variables commencent par `NEXT_PUBLIC_`
- Vérifiez qu'elles sont bien dans les environnements Production/Preview/Development

### "Permission denied"
- Vérifiez que les règles Firestore sont bien déployées
- Vérifiez que vous êtes en mode "test" ou que les règles sont correctes

### Les données n'apparaissent pas
- Vérifiez dans Firebase Console > Firestore Database
- Vérifiez les logs Vercel pour les erreurs
