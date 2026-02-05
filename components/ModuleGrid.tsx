import { ModuleType } from '@prisma/client';
import BlurredPremiumCard from './BlurredPremiumCard';

interface Module {
  type: ModuleType;
  isUnlocked: boolean;
}

interface ModuleGridProps {
  modules: Module[];
  onUnlock: (moduleType: ModuleType) => void;
  unlockingModule?: ModuleType | null;
}

const MODULE_INFO: Record<ModuleType, { title: string; description: string; teaser: string }> = {
  YEAR: {
    title: 'Année Personnelle',
    description: 'Découvrez les énergies de votre année personnelle',
    teaser: 'Votre année personnelle révèle des opportunités uniques et des défis à surmonter. Découvrez comment les énergies numérologiques influencent votre parcours cette année...',
  },
  MONTH: {
    title: 'Mois Personnel',
    description: 'Analyse détaillée de votre mois personnel',
    teaser: 'Chaque mois apporte ses propres vibrations. Comprenez les énergies qui vous accompagnent ce mois et comment en tirer le meilleur parti...',
  },
  NEXT_12_MONTHS: {
    title: '12 Prochains Mois',
    description: 'Prévisions pour les 12 prochains mois',
    teaser: 'Une vision complète de votre année à venir. Découvrez les tendances, opportunités et moments clés qui marqueront les 12 prochains mois...',
  },
  LOVE: {
    title: 'Amour & Relations',
    description: 'Votre compatibilité et vos relations amoureuses',
    teaser: 'Votre profil numérologique révèle des secrets sur votre façon d\'aimer et vos compatibilités. Explorez la dimension amoureuse de votre personnalité...',
  },
  MOTHER: {
    title: 'Relation Maternelle',
    description: 'Analyse de votre relation avec votre mère',
    teaser: 'Comprenez les dynamiques profondes de votre relation maternelle à travers le prisme de la numérologie. Découvrez les enseignements et les défis...',
  },
  FATHER: {
    title: 'Relation Paternelle',
    description: 'Analyse de votre relation avec votre père',
    teaser: 'Explorez les énergies qui façonnent votre relation paternelle. Cette analyse révèle les patterns et les opportunités de croissance...',
  },
  WORK: {
    title: 'Carrière & Travail',
    description: 'Votre chemin professionnel et vos talents',
    teaser: 'Vos nombres révèlent vos talents cachés et votre chemin professionnel idéal. Découvrez comment aligner votre carrière avec votre essence...',
  },
  MISSION: {
    title: 'Mission de Vie',
    description: 'Votre mission et votre raison d\'être',
    teaser: 'Quelle est votre mission sur cette Terre ? Votre profil numérologique dévoile votre raison d\'être et les moyens de l\'accomplir...',
  },
  DEEP_PROFILE: {
    title: 'Profil Approfondi',
    description: 'Analyse complète et détaillée de votre profil',
    teaser: 'L\'analyse la plus complète de votre profil numérologique. Une exploration approfondie de tous les aspects de votre personnalité et de votre chemin...',
  },
};

export default function ModuleGrid({
  modules,
  onUnlock,
  unlockingModule,
}: ModuleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => {
        const info = MODULE_INFO[module.type];
        return (
          <BlurredPremiumCard
            key={module.type}
            title={info.title}
            description={info.description}
            teaserContent={info.teaser}
            isUnlocked={module.isUnlocked}
            onUnlock={() => onUnlock(module.type)}
            isLoading={unlockingModule === module.type}
          >
            {module.isUnlocked && (
              <div className="text-sm text-gray-600">
                <p>Contenu du module à venir...</p>
              </div>
            )}
          </BlurredPremiumCard>
        );
      })}
    </div>
  );
}
