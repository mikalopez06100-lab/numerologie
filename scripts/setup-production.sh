#!/bin/bash

# Script de configuration pour production
# Usage: ./scripts/setup-production.sh

echo "🚀 Configuration Production - Numérologie App"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."
npm install

# Générer le client Prisma
echo ""
echo "🔧 Génération du client Prisma..."
npm run db:generate

# Vérifier les variables d'environnement
echo ""
echo "🔍 Vérification des variables d'environnement..."

required_vars=("DATABASE_URL" "ADMIN_TOKEN" "NEXT_PUBLIC_SITE_URL")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "⚠️  Variables manquantes:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Configurez-les dans Vercel → Settings → Environment Variables"
else
    echo "✅ Toutes les variables requises sont présentes"
fi

# Build de test
echo ""
echo "🏗️  Test du build..."
if npm run build; then
    echo "✅ Build réussi !"
else
    echo "❌ Erreur lors du build"
    exit 1
fi

echo ""
echo "✨ Configuration terminée !"
echo ""
echo "Prochaines étapes:"
echo "1. Configurez les variables d'environnement dans Vercel"
echo "2. Migrez la base de données: npx prisma db push"
echo "3. Déployez sur Vercel"
echo ""
echo "📖 Consultez GUIDE_DEPLOIEMENT.md pour plus de détails"
