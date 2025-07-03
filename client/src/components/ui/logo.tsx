import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 'w-6 h-6', text: 'text-sm' },
  md: { icon: 'w-8 h-8', text: 'text-base' },
  lg: { icon: 'w-10 h-10', text: 'text-lg' },
  xl: { icon: 'w-12 h-12', text: 'text-xl' }
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${icon} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#6366F1', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:1}} />
            </linearGradient>
            <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#FFFFFF', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#F8FAFC', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          <circle cx="20" cy="20" r="20" fill="url(#bgGradient)"/>
          <path d="M20 8v24M12 16h16" stroke="url(#crossGradient)" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="14" cy="26" r="1.5" fill="#FFFFFF" opacity="0.8"/>
          <circle cx="18" cy="28" r="1.5" fill="#FFFFFF" opacity="0.9"/>
          <circle cx="22" cy="28" r="1.5" fill="#FFFFFF"/>
          <circle cx="26" cy="26" r="1.5" fill="#FFFFFF" opacity="0.7"/>
          <circle cx="20" cy="20" r="18" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3"/>
        </svg>
      </div>
      {showText && (
        <div>
          <h1 className={`font-bold text-gray-900 ${text}`}>
            Faith<span className="text-indigo-600">Traka</span>
          </h1>
        </div>
      )}
    </div>
  );
}

export function LogoIcon({ size = 'md', className = '' }: Omit<LogoProps, 'showText'>) {
  return <Logo size={size} showText={false} className={className} />;
}
