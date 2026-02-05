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
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du profil');
      }

      const data = await response.json();
      router.push(`/analyse/${data.profileId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#FAF7F2] mb-4">
            Découvrez votre profil numérologique
          </h1>
          <p className="text-xl text-gray-300 max-w-xl mx-auto">
            Une analyse personnalisée basée sur votre date de naissance et votre nom
          </p>
        </div>

        {/* Formulaire */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Prénom *"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Jean"
              />
              <Input
                label="Nom *"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Dupont"
              />
            </div>

            <Input
              label="Date de naissance *"
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
            />

            <Input
              label="Lieu de naissance"
              type="text"
              value={formData.birthPlace}
              onChange={(e) =>
                setFormData({ ...formData, birthPlace: e.target.value })
              }
              placeholder="Paris (optionnel)"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Lancer mon analyse
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
