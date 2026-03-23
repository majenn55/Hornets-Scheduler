'use client';

interface SportIconProps {
  sport: string;
  size?: 'sm' | 'md' | 'lg';
}

const sportEmojis: Record<string, string> = {
  SOCCER: '\u26BD',
  SOFTBALL: '\u{1F94E}',
  BASKETBALL: '\u{1F3C0}',
};

const sportColors: Record<string, string> = {
  SOCCER: 'bg-green-100 text-green-700',
  SOFTBALL: 'bg-yellow-100 text-yellow-700',
  BASKETBALL: 'bg-orange-100 text-orange-700',
};

const sizes = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-lg',
  lg: 'w-14 h-14 text-2xl',
};

export default function SportIcon({ sport, size = 'md' }: SportIconProps) {
  return (
    <div
      className={`${sizes[size]} ${sportColors[sport] || 'bg-gray-100 text-gray-600'} rounded-lg flex items-center justify-center`}
    >
      {sportEmojis[sport] || '?'}
    </div>
  );
}

export function SportBadge({ sport }: { sport: string }) {
  const colors: Record<string, string> = {
    SOCCER: 'badge-green',
    SOFTBALL: 'badge-yellow',
    BASKETBALL: 'bg-orange-100 text-orange-800',
  };

  return (
    <span className={`badge ${colors[sport] || 'badge-gray'}`}>
      {sportEmojis[sport]} {sport.charAt(0) + sport.slice(1).toLowerCase()}
    </span>
  );
}
