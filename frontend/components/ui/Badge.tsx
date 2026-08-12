import React from 'react';

export interface BadgeProps {
  variant?: 'olive' | 'muted' | 'outline' | 'verified';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'olive',
  children,
  className = '',
}) => {
  const variantStyles = {
    olive: "bg-[#6B7A3A] text-white",
    muted: "bg-[#A8B589]/30 text-[#4A5A2A]",
    outline: "border border-[#A8B589] text-[#2B2B26]",
    verified: "bg-[#6B7A3A]/10 text-[#4A5A2A] border border-[#6B7A3A]/20 font-semibold",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
