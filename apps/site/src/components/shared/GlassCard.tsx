import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  dark = false,
  hoverEffect = false
}) => {
  return (
    <div className={`
      ${dark ? 'glass-panel-dark' : 'glass-panel'} 
      rounded-2xl p-6 
      ${hoverEffect ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
