'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Timeout de 60 secondes pour l'appel API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          birthPlace: formData.birthPlace || undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du profil');
      }

      const data = await response.json();
      router.push(`/analyse/${data.profileId}`);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('La requête a pris trop de temps. Veuillez réessayer.');
      } else {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden cosmic-bg flex items-center justify-center px-4 py-12">
      {/* Étoiles et constellations en arrière-plan */}
      <div className="absolute inset-0 stars-overlay"></div>
      
      {/* Cercle lumineux en haut */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#FAF7F2] mb-4 leading-tight">
            Votre Profil
            <br />
            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Numérologique
            </span>
            <br />
            en 30 secondes
          </h1>
          <p className="text-xl text-gray-300 max-w-xl mx-auto mt-6">
            Une analyse immédiate, précise et personnalisée.
          </p>
        </div>

        {/* Formulaire dans une boîte semi-transparente */}
        <div className="glass-form-container">
          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Prénom"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder=""
                className="glass-input"
              />
              <div>
                <Input
                  label="Nom"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder=""
                  className="glass-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#FAF7F2]">
                Naissance
              </label>
              <Input
                label="Date de naissance"
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className="glass-input"
              />
            </div>

            <Input
              label="Lieu de naissance (optionnel)"
              type="text"
              value={formData.birthPlace}
              onChange={(e) =>
                setFormData({ ...formData, birthPlace: e.target.value })
              }
              placeholder=""
              className="glass-input"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-button py-4 px-8 rounded-lg font-medium text-white text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Chargement...
                </>
              ) : (
                <>
                  Lancer mon analyse
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preuve sociale avec étoiles */}
        <div className="text-center mt-12">
          <p className="text-gray-300 mb-3">
            <strong className="text-[#FAF7F2]">10 000+</strong> analyses déjà réalisées
          </p>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 text-[#DCC48E]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
