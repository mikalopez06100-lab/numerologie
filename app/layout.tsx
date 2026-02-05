import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Numérologie Premium - Analyse Personnalisée par IA',
  description: 'Découvrez votre profil numérologique personnalisé avec des analyses approfondies générées par intelligence artificielle. Chemin de vie, expression, mission de vie et plus encore.',
  keywords: ['numérologie', 'profil numérologique', 'chemin de vie', 'analyse personnalisée', 'IA'],
  authors: [{ name: 'Numérologie Premium' }],
  openGraph: {
    title: 'Numérologie Premium - Analyse Personnalisée',
    description: 'Découvrez votre profil numérologique personnalisé avec des analyses approfondies',
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://votre-domaine.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Numérologie Premium',
    description: 'Découvrez votre profil numérologique personnalisé',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
