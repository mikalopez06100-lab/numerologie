import { ReactNode } from 'react';
import Button from './ui/Button';

interface BlurredPremiumCardProps {
  title: string;
  description?: string;
  price?: string;
  isUnlocked: boolean;
  onUnlock?: () => void;
  children?: ReactNode;
  isLoading?: boolean;
  teaserContent?: string; // Contenu teasing visible même quand flouté
}

export default function BlurredPremiumCard({
  title,
  description,
  price = '2 € (SMS)',
  isUnlocked,
  onUnlock,
  children,
  isLoading = false,
  teaserContent,
}: BlurredPremiumCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Contenu principal */}
      <div
        className={`
          bg-[#FAF7F2] text-[#0D1B2A] p-6
          transition-all duration-300
          ${!isUnlocked ? 'blur-sm' : ''}
        `}
      >
        <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
        {!isUnlocked && teaserContent && (
          <div className="mb-4 p-3 bg-white/50 rounded-lg border border-[#DCC48E]/30">
            <p className="text-sm text-gray-700 line-clamp-3">{teaserContent}</p>
          </div>
        )}
        {children}
      </div>

      {/* Overlay flou pour contenu non débloqué */}
      {!isUnlocked && (
        <div className="absolute inset-0 glass-strong flex flex-col items-center justify-center p-6 z-10">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="w-12 h-12 mx-auto text-[#DCC48E]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="text-[#FAF7F2] font-medium mb-4">
              Contenu premium
            </p>
            {onUnlock && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onUnlock}
                isLoading={isLoading}
              >
                Débloquer — {price}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
