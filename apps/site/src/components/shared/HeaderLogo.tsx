import React from 'react';

interface HeaderLogoProps {
  src: string;
  onNavigate?: () => void;
}

export const HeaderLogo = React.forwardRef<HTMLDivElement, HeaderLogoProps>(
  ({ src, onNavigate }, ref) => (
    <div ref={ref} className="header-brand flex min-w-0 items-center">
      <a
        href="#"
        onClick={onNavigate}
        aria-label="Voltar ao topo"
        className="header-brand-link flex shrink-0 items-center py-1"
      >
        <img
          src={src}
          alt="CBDAS Brasília 2026"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          width={204}
          height={160}
          className="header-brand-image block h-[46px] max-h-[52px] w-auto max-w-[197px] object-contain sm:h-[58px] sm:max-h-[64px] sm:max-w-[244px] lg:h-auto lg:w-full"
        />
      </a>
    </div>
  ),
);

HeaderLogo.displayName = 'HeaderLogo';
