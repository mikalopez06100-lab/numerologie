/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Configuration Next.js pour Vercel
  eslint: {
    // Désactiver ESLint pendant le build (optionnel en production)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build (optionnel)
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
