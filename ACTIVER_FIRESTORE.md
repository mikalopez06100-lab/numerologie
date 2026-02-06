# 🔥 Guide : Activer l'API Firestore

## ⚠️ Problème actuel
L'erreur `PERMISSION_DENIED: Cloud Firestore API has not been used in project numerologie-app before or it is disabled` signifie que l'API Firestore n'est pas activée.

## ✅ Solution 1 : Via Google Cloud Console (RECOMMANDÉ)

### Étape 1 : Accéder à la page d'activation
1. **Cliquez sur ce lien** : https://console.cloud.google.com/apis/library/firestore.googleapis.com?project=numerologie-app
2. Si vous n'êtes pas connecté, connectez-vous avec votre compte Google

### Étape 2 : Vérifier le projet
- En haut de la page, vérifiez que le projet sélectionné est bien **`numerologie-app`**
- Si ce n'est pas le bon projet, cliquez sur le nom du projet et sélectionnez `numerologie-app`

### Étape 3 : Activer l'API
- Cliquez sur le bouton **"ACTIVER"** ou **"ENABLE"** (bouton bleu en haut)
- Attendez quelques secondes...

### Étape 4 : Vérifier
- Vous devriez voir "API activée" ou "API enabled"
- **Attendez 2-3 minutes** pour que la propagation soit effective

---

## ✅ Solution 2 : Via Firebase Console

### Étape 1 : Accéder à Firebase
1. Allez sur : https://console.firebase.google.com/
2. Connectez-vous si nécessaire
3. Cliquez sur votre projet **`numerologie-app`**

### Étape 2 : Accéder à Firestore
1. Dans le menu de gauche, cliquez sur **"Firestore Database"** (icône de base de données)
2. OU allez directement sur : https://console.firebase.google.com/project/numerologie-app/firestore

### Étape 3 : Créer la base de données
1. Si vous voyez **"Créer une base de données"** ou **"Create database"**, cliquez dessus
2. Choisissez **"Démarrer en mode test"** (Start in test mode)
3. Sélectionnez une région (ex: `europe-west` ou `us-central`)
4. Cliquez sur **"Activer"** ou **"Enable"**

### Étape 4 : Attendre
- Attendez 2-3 minutes pour que la base de données soit créée et l'API activée

---

## ✅ Solution 3 : Via l'URL directe d'activation

**Cliquez simplement sur ce lien** (vous devrez peut-être vous connecter) :
https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=numerologie-app

Puis cliquez sur **"Activer"** ou **"Enable"**.

---

## 🔍 Vérification

Après activation, testez à nouveau votre application. Les logs Vercel ne devraient plus montrer l'erreur `PERMISSION_DENIED`.

---

## 🆘 Si ça ne fonctionne pas

1. **Vérifiez que vous êtes connecté au bon compte Google**
2. **Vérifiez que le projet `numerologie-app` existe bien**
3. **Vérifiez que vous avez les droits d'administration sur le projet**
4. **Attendez 5-10 minutes** après activation (parfois la propagation prend du temps)

---

## 📝 Note importante

L'activation de l'API Firestore est **gratuite**. Vous ne serez facturé que pour l'utilisation (lecture/écriture de documents), et Firebase offre un quota gratuit généreux.
