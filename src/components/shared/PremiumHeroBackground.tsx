import React from 'react';

interface PremiumHeroBackgroundProps {
  showOverlay?: boolean;
  className?: string;
}

export const PremiumHeroBackground: React.FC<PremiumHeroBackgroundProps> = ({
  showOverlay = true,
  className = '',
}) => {
  const rootClassName = className
    ? `premium-hero-background ${className}`
    : 'premium-hero-background';

  return (
    <div className={rootClassName} aria-hidden="true">
      <div className="premium-hero-background__base" />
      <div className="premium-hero-background__ambient premium-hero-background__ambient--top" />
      <div className="premium-hero-background__ambient premium-hero-background__ambient--bottom" />
      <div className="premium-hero-background__beam premium-hero-background__beam--left" />
      <div className="premium-hero-background__beam premium-hero-background__beam--bottom" />
      <div className="premium-hero-background__mist premium-hero-background__mist--left" />
      <div className="premium-hero-background__mist premium-hero-background__mist--lower" />
      <div className="premium-hero-background__highlight premium-hero-background__highlight--top" />
      <div className="premium-hero-background__highlight premium-hero-background__highlight--side" />
      <div className="premium-hero-background__vignette" />
      {showOverlay ? <div className="premium-hero-background__overlay" /> : null}
    </div>
  );
};
