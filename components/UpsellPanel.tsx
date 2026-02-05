import { ModuleType } from '@prisma/client';
import Card from './ui/Card';
import Button from './ui/Button';

interface UpsellPanelProps {
  unlockedModule: ModuleType;
  onModuleClick: (moduleType: ModuleType) => void;
  onClose?: () => void;
}

const MODULE_SUGGESTIONS: Record<ModuleType, ModuleType[]> = {
  YEAR: ['MONTH', 'NEXT_12_MONTHS'],
  MONTH: ['YEAR', 'NEXT_12_MONTHS'],
  NEXT_12_MONTHS: ['YEAR', 'MISSION'],
  LOVE: ['MISSION', 'DEEP_PROFILE'],
  MOTHER: ['FATHER', 'DEEP_PROFILE'],
  FATHER: ['MOTHER', 'DEEP_PROFILE'],
  WORK: ['MISSION', 'DEEP_PROFILE'],
  MISSION: ['DEEP_PROFILE', 'WORK'],
  DEEP_PROFILE: ['MISSION', 'WORK'],
};

const MODULE_NAMES: Record<ModuleType, string> = {
  YEAR: 'Année Personnelle',
  MONTH: 'Mois Personnel',
  NEXT_12_MONTHS: '12 Prochains Mois',
  LOVE: 'Amour & Relations',
  MOTHER: 'Relation Maternelle',
  FATHER: 'Relation Paternelle',
  WORK: 'Carrière & Travail',
  MISSION: 'Mission de Vie',
  DEEP_PROFILE: 'Profil Approfondi',
};

export default function UpsellPanel({
  unlockedModule,
  onModuleClick,
  onClose,
}: UpsellPanelProps) {
  const suggestions = MODULE_SUGGESTIONS[unlockedModule] || ['MISSION', 'DEEP_PROFILE'];

  return (
    <Card className="bg-gradient-to-r from-[#4F3AA2] to-[#5F4AB2] text-white border-0">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-serif text-xl font-bold mb-2">
            🎉 Module débloqué avec succès !
          </h3>
          <p className="text-sm opacity-90">
            Découvrez d'autres analyses pour approfondir votre profil numérologique
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Fermer"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((moduleType) => (
          <Button
            key={moduleType}
            variant="secondary"
            size="sm"
            onClick={() => onModuleClick(moduleType)}
            className="w-full"
          >
            {MODULE_NAMES[moduleType]}
          </Button>
        ))}
      </div>
    </Card>
  );
}
