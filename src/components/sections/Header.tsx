import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ExternalLink } from 'lucide-react';
import { eventData } from '../../config/eventData';
import { sectionVisibility } from '../../config/sectionVisibility';
import { CTAButton } from '../shared/CTAButton';
import { HeaderLogo } from '../shared/HeaderLogo';
import { handleInPageNavClick } from '../../utils/scrollToSection';
import lightLogo from '../../assets/logo.svg';
import darkLogo from '../../assets/logodark.webp';

const headerMenuItems = [
  { label: 'Inscrições', href: '#inscricoes', visible: sectionVisibility.header.showInscricoes },
  { label: 'Programação', href: '#programacao', visible: sectionVisibility.header.showProgramacao },
  { label: 'Oficinas', href: '#oficinas', visible: sectionVisibility.header.showOficinas },
  { label: 'Palestrantes Confirmados', href: '#palestrantes', visible: sectionVisibility.header.showSpeakers },
  { label: 'Patrocinadores', href: '#patrocinadores', visible: sectionVisibility.header.showSponsors },
  { label: 'Submissão de Artigos', href: '#artigos-cientificos', visible: sectionVisibility.header.showArticleSubmission },
  { label: 'Guia', href: '#guia-cbdas', visible: sectionVisibility.header.showGuide },
  { label: 'Local', href: '#local', visible: sectionVisibility.header.showLocal },
  { label: 'Contato', href: '#contato', visible: sectionVisibility.header.showContato },
] as const;

const DESKTOP_BREAKPOINT = 1024;
const HEADER_LAYOUT_BUFFER = 0;
const DESKTOP_LINK_CLIP_BUFFER = 1;

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [isDesktopMenuCollapsed, setIsDesktopMenuCollapsed] = useState(false);
  const headerShellRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const desktopNavMeasureRef = useRef<HTMLDivElement>(null);
  const desktopLinksRef = useRef<HTMLDivElement>(null);
  const brandLogo = isScrolled ? lightLogo : darkLogo;

  useEffect(() => {
    let frameId = 0;

    const updateScrollState = () => {
      frameId = 0;
      const nextIsScrolled = window.scrollY > 50;
      setIsScrolled((currentValue) =>
        currentValue === nextIsScrolled ? currentValue : nextIsScrolled,
      );
    };

    const handleScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = useMemo(() => headerMenuItems.filter((item) => item.visible), []);

  useLayoutEffect(() => {
    let frameId = 0;
    let fontsCancelled = false;

    const updateDesktopLayout = () => {
      frameId = 0;

      const nextIsDesktopViewport = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktopViewport((currentValue) =>
        currentValue === nextIsDesktopViewport ? currentValue : nextIsDesktopViewport,
      );

      if (!nextIsDesktopViewport) {
        setIsDesktopMenuCollapsed((currentValue) => (currentValue ? false : currentValue));
        return;
      }

      const headerShell = headerShellRef.current;
      const logoElement = logoRef.current;
      const navMeasure = desktopNavMeasureRef.current;

      if (!headerShell || !logoElement || !navMeasure) {
        return;
      }

      const headerWidth = headerShell.getBoundingClientRect().width;
      const logoWidth = logoElement.getBoundingClientRect().width;
      const navWidth = navMeasure.getBoundingClientRect().width;
      const headerStyles = window.getComputedStyle(headerShell);
      const gapWidth = parseFloat(headerStyles.columnGap || headerStyles.gap || '0');
      const availableWidth = headerWidth - logoWidth - gapWidth;
      const desktopLinks = desktopLinksRef.current;
      const firstDesktopLink = desktopLinks?.querySelector('a');
      const desktopLinksRect = desktopLinks?.getBoundingClientRect();
      const firstDesktopLinkRect = firstDesktopLink?.getBoundingClientRect();
      const isFirstLinkClipped = Boolean(
        desktopLinksRect &&
          firstDesktopLinkRect &&
          firstDesktopLinkRect.left < desktopLinksRect.left + DESKTOP_LINK_CLIP_BUFFER,
      );
      const shouldCollapse =
        navWidth + HEADER_LAYOUT_BUFFER > availableWidth || isFirstLinkClipped;

      setIsDesktopMenuCollapsed((currentValue) =>
        currentValue === shouldCollapse ? currentValue : shouldCollapse,
      );

      if (!shouldCollapse) {
        setIsMenuOpen((currentValue) => (currentValue ? false : currentValue));
      }
    };

    const scheduleLayoutUpdate = () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(updateDesktopLayout);
    };

    scheduleLayoutUpdate();

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleLayoutUpdate);

    if (resizeObserver) {
      if (headerShellRef.current) {
        resizeObserver.observe(headerShellRef.current);
      }

      if (logoRef.current) {
        resizeObserver.observe(logoRef.current);
      }

      if (desktopNavMeasureRef.current) {
        resizeObserver.observe(desktopNavMeasureRef.current);
      }
    }

    window.addEventListener('resize', scheduleLayoutUpdate, { passive: true });

    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (!fontsCancelled) {
          scheduleLayoutUpdate();
        }
      });
    }

    return () => {
      fontsCancelled = true;

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleLayoutUpdate);
    };
  }, [menuItems.length]);

  const linkToneClass = isScrolled ? 'text-gray-700' : 'text-white/90';
  const desktopLinkClassName = `header-nav-link type-nav whitespace-nowrap transition-colors hover:text-idasan-yellow ${linkToneClass}`;
  const desktopButtonToneClass = isScrolled
    ? 'border-slate-200 bg-white text-idasan-blue shadow-sm'
    : 'border-white/20 bg-white/10 text-white';

  const renderHeaderLinks = ({
    linkClassName,
    iconClassName,
    onItemClick,
  }: {
    linkClassName: string;
    iconClassName: string;
    onItemClick?: () => void;
  }) => (
    <>
      {menuItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={(event) => {
            handleInPageNavClick(event, item.href, onItemClick);
          }}
          className={linkClassName}
        >
          {item.label}
        </a>
      ))}

      {sectionVisibility.header.showSponsorLink && (
        <a
          href={eventData.general.sponsorFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onItemClick}
          className={`${linkClassName} flex items-center gap-1.5`}
        >
          Seja um patrocinador <ExternalLink className={iconClassName} />
        </a>
      )}
    </>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-white/90 backdrop-blur-md shadow-md' : 'py-6 bg-transparent'
      }`}
    >
      <div
        ref={headerShellRef}
        className="header-shell container relative mx-auto flex items-center justify-between gap-4 px-4 md:px-6"
      >
        <HeaderLogo src={brandLogo} onNavigate={() => setIsMenuOpen(false)} ref={logoRef} />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 hidden h-0 overflow-hidden opacity-0 lg:block"
        >
          <div
            ref={desktopNavMeasureRef}
            className="header-desktop-nav flex w-max items-center gap-3 xl:gap-5"
          >
            <div className="header-desktop-links flex items-center gap-3 xl:gap-5">
              {renderHeaderLinks({
                linkClassName: 'header-nav-link type-nav whitespace-nowrap text-gray-700',
                iconClassName: 'h-3 w-3',
              })}
            </div>

            <CTAButton
              href={eventData.general.ctaLink}
              target="_self"
              variant="primary"
              className="header-desktop-cta !px-5 !py-2 !text-sm xl:!px-6"
              icon={false}
            >
              Inscreva-se
            </CTAButton>
          </div>
        </div>

        <nav
          className={`header-desktop-nav hidden min-w-0 items-center justify-end gap-3 overflow-hidden xl:gap-5 lg:flex ${
            isDesktopMenuCollapsed ? 'lg:invisible lg:absolute lg:pointer-events-none' : ''
          }`}
        >
          <div
            ref={desktopLinksRef}
            className="header-desktop-links flex min-w-0 items-center justify-end gap-3 overflow-hidden xl:gap-5"
          >
            {renderHeaderLinks({
              linkClassName: desktopLinkClassName,
              iconClassName: 'h-3 w-3',
            })}
          </div>

          <CTAButton
            href={eventData.general.ctaLink}
            target="_self"
            variant={isScrolled ? 'primary' : 'gold'}
            className="header-desktop-cta !px-5 !py-2 !text-sm xl:!px-6"
            icon={false}
          >
            Inscreva-se
          </CTAButton>
        </nav>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          className={`header-desktop-toggle items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
            isDesktopViewport && isDesktopMenuCollapsed ? 'hidden lg:flex' : 'hidden'
          } ${desktopButtonToneClass}`}
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span className="type-nav">Menu</span>
        </button>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          className="p-2 text-current lg:hidden"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
        >
          {isMenuOpen ? (
            <X className={isScrolled ? 'text-idasan-blue' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-idasan-blue' : 'text-white'} />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isMenuOpen && isDesktopMenuCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="header-dropdown-shell hidden lg:block"
          >
            <div className="header-dropdown-wrap container mx-auto px-4 md:px-6">
              <div className="header-dropdown-panel w-full p-5 md:p-6">
                <div className="header-dropdown-grid grid gap-3 md:grid-cols-2">
                  {menuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(event) => {
                        handleInPageNavClick(event, item.href, () => setIsMenuOpen(false));
                      }}
                      className="header-dropdown-link type-nav rounded-2xl px-4 py-3 text-idasan-blue transition-colors hover:text-idasan-blue"
                    >
                      {item.label}
                    </a>
                  ))}

                  {sectionVisibility.header.showSponsorLink && (
                    <a
                      href={eventData.general.sponsorFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="header-dropdown-link type-nav flex items-center justify-between rounded-2xl px-4 py-3 text-idasan-blue transition-colors hover:text-idasan-blue"
                    >
                      Seja um patrocinador <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="header-dropdown-action mt-5 flex justify-center">
                  <CTAButton
                    href={eventData.general.ctaLink}
                    target="_self"
                    variant="primary"
                    className="justify-center !px-6 !py-3"
                    icon={false}
                  >
                    Inscreva-se
                  </CTAButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white lg:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(event) => {
                    handleInPageNavClick(event, item.href, () => setIsMenuOpen(false));
                  }}
                  className="type-nav border-b border-gray-50 py-2 text-idasan-blue"
                >
                  {item.label}
                </a>
              ))}

              {sectionVisibility.header.showSponsorLink && (
                <a
                  href={eventData.general.sponsorFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="type-nav flex items-center gap-2 border-b border-gray-50 py-2 text-idasan-blue"
                >
                  Seja um patrocinador <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <CTAButton href={eventData.general.ctaLink} target="_self" fullWidth className="mt-4">
                Inscreva-se
              </CTAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
