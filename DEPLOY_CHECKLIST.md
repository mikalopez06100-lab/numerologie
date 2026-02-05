# ✅ Checklist de Déploiement

## Avant de Commencer

- [ ] Code testé localement (`npm run build` fonctionne)
- [ ] Compte GitHub créé
- [ ] Code poussé sur GitHub

---

## 1. Déploiement Vercel (5 min)

- [ ] Compte Vercel créé ([vercel.com](https://vercel.com))
- [ ] Projet connecté à GitHub
- [ ] Premier déploiement réussi
- [ ] Site accessible sur `votre-projet.vercel.app`

---

## 2. Base de Données (10 min)

- [ ] Compte Supabase créé ([supabase.com](https://supabase.com))
- [ ] Nouveau projet créé
- [ ] Database URL copiée
- [ ] `prisma/schema.prisma` modifié (provider = "postgresql")
- [ ] Migration exécutée : `npx prisma db push`
- [ ] `DATABASE_URL` ajouté dans Vercel

---

## 3. OpenAI (5 min)

- [ ] Compte OpenAI créé ([platform.openai.com](https://platform.openai.com))
- [ ] Méthode de paiement ajoutée
- [ ] Clé API créée (copiée et sauvegardée)
- [ ] `OPENAI_API_KEY` ajouté dans Vercel

---

## 4. Variables d'Environnement

Dans Vercel → Settings → Environment Variables :

- [ ] `DATABASE_URL` = URL Postgres
- [ ] `OPENAI_API_KEY` = Clé API OpenAI
- [ ] `ADMIN_TOKEN` = Token fort généré
- [ ] `NEXT_PUBLIC_SITE_URL` = URL du site
- [ ] `NODE_ENV` = `production`

---

## 5. Domaine Personnalisé (Optionnel)

- [ ] Domaine acheté (si nécessaire)
- [ ] Domaine ajouté dans Vercel
- [ ] DNS configurés
- [ ] Propagation DNS vérifiée
- [ ] HTTPS actif (automatique)

---

## 6. Tests Post-Déploiement

- [ ] Site accessible
- [ ] Formulaire de création de profil fonctionne
- [ ] Rapport gratuit généré
- [ ] Déblocage de module fonctionne
- [ ] OpenAI génère du contenu
- [ ] Route admin stats accessible
- [ ] Headers sécurité présents

---

## 7. Monitoring

- [ ] Logs Vercel vérifiés
- [ ] Usage OpenAI vérifié
- [ ] Base de données accessible
- [ ] Alertes configurées (OpenAI budget)

---

## 🎉 Déploiement Terminé !

**Ressources :**
- Guide rapide : `QUICK_START_DEPLOY.md`
- Guide complet : `GUIDE_DEPLOIEMENT.md`
- Support : Voir README.md
