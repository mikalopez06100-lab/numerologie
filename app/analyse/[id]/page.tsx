'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import SectionTitle from '@/components/ui/SectionTitle';
import ModuleGrid from '@/components/ModuleGrid';
import UpsellPanel from '@/components/UpsellPanel';
import SocialProof from '@/components/SocialProof';
import { ModuleType } from '@prisma/client';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string | null;
  numerology: {
    lifePath: number;
    expression: number;
    soulUrge: number;
    personality: number | null;
  } | null;
  unlocks: Array<{
    id: string;
    moduleType: ModuleType;
    isUnlocked: boolean;
  }>;
  reports: Array<{
    id: string;
    type: string;
  }>;
}

const ALL_MODULE_TYPES: ModuleType[] = [
  'YEAR',
  'MONTH',
  'NEXT_12_MONTHS',
  'LOVE',
  'MOTHER',
  'FATHER',
  'WORK',
  'MISSION',
  'DEEP_PROFILE',
];

export default function AnalysePage() {
  const params = useParams();
  const profileId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlockingModule, setUnlockingModule] = useState<ModuleType | null>(
    null
  );
  const [lastUnlockedModule, setLastUnlockedModule] = useState<ModuleType | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/profile/${profileId}`);

      if (!response.ok) {
        throw new Error('Profil non trouvé');
      }

      const data = await response.json();
      setProfile(data);
      
      // Logger la visualisation du rapport gratuit
      if (data.reports?.some((r: { type: string }) => r.type === 'FREE')) {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'free_report_viewed',
            profileId: data.id,
          }),
        }).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const handleUnlock = async (moduleType: ModuleType) => {
    try {
      setUnlockingModule(moduleType);
      
      // Logger le clic sur débloquer
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'unlock_clicked',
          profileId,
          metadata: { moduleType },
        }),
      }).catch(() => {});

      const response = await fetch('/api/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          moduleType,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du déblocage');
      }

      // Re-fetch le profil pour mettre à jour les unlocks
      await fetchProfile();
      
      // Afficher l'upsell
      setLastUnlockedModule(moduleType);
      setShowUpsell(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors du déblocage');
    } finally {
      setUnlockingModule(null);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F3AA2]"></div>
            <p className="mt-4 text-gray-300">Chargement de votre analyse...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Card>
            <div className="text-center">
              <p className="text-red-400 mb-4">{error || 'Profil non trouvé'}</p>
              <a
                href="/"
                className="text-[#4F3AA2] hover:text-[#5F4AB2] underline"
              >
                Retour à l'accueil
              </a>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  // Construire la liste des modules avec leur statut de déblocage
  const modules = ALL_MODULE_TYPES.map((type) => {
    const unlock = profile.unlocks.find((u) => u.moduleType === type);
    return {
      type,
      isUnlocked: unlock?.isUnlocked ?? false,
    };
  });

  // Trouver le rapport gratuit (FREE)
  const freeReport = profile.reports.find((r) => r.type === 'FREE');

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#FAF7F2] mb-2">
            Votre Analyse, {profile.firstName}
          </h1>
          <p className="text-gray-300">
            Découvrez votre profil numérologique complet
          </p>
        </div>

        {/* Numérologie de base */}
        {profile.numerology && (
          <div className="mb-12">
            <SectionTitle
              title="Vos Nombres Fondamentaux"
              subtitle="Les nombres qui définissent votre personnalité"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4F3AA2] mb-1">
                    {profile.numerology.lifePath}
                  </div>
                  <div className="text-sm text-gray-600">Chemin de Vie</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4F3AA2] mb-1">
                    {profile.numerology.expression}
                  </div>
                  <div className="text-sm text-gray-600">Expression</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4F3AA2] mb-1">
                    {profile.numerology.soulUrge}
                  </div>
                  <div className="text-sm text-gray-600">Aspiration de l'Âme</div>
                </div>
              </Card>
              {profile.numerology.personality && (
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#4F3AA2] mb-1">
                      {profile.numerology.personality}
                    </div>
                    <div className="text-sm text-gray-600">Personnalité</div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Rapport gratuit */}
        <div className="mb-12">
          <SectionTitle
            title="Analyse Gratuite"
            subtitle="Votre premier aperçu numérologique"
          />
          <Card>
            {freeReport ? (
              <div>
                <p className="text-gray-600">
                  Contenu du rapport gratuit à venir...
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">
                  Votre rapport gratuit sera disponible prochainement.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Preuve sociale */}
        <div className="mb-12">
          <SocialProof />
        </div>

        {/* Upsell après déblocage */}
        {showUpsell && lastUnlockedModule && (
          <div className="mb-12">
            <UpsellPanel
              unlockedModule={lastUnlockedModule}
              onModuleClick={(moduleType) => {
                setShowUpsell(false);
                handleUnlock(moduleType);
              }}
              onClose={() => setShowUpsell(false)}
            />
          </div>
        )}

        {/* Modules premium */}
        <div className="mb-12">
          <SectionTitle
            title="Modules Premium"
            subtitle="Débloquez des analyses approfondies pour découvrir tous les aspects de votre profil"
          />
          <ModuleGrid
            modules={modules}
            onUnlock={handleUnlock}
            unlockingModule={unlockingModule}
          />
        </div>
      </div>
    </main>
  );
}
