import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import elementosBrasilia from '../../assets/elementosbrasilia2.png';
import { eventData } from '../../config/eventData';
import { handleInPageNavClick } from '../../utils/scrollToSection';

type CongressAction = {
  label: string;
  href: string;
  target?: '_blank';
  rel?: string;
};

const externalLink = {
  target: '_blank' as const,
  rel: 'noopener noreferrer',
};

const congressActions: CongressAction[] = [
  { label: 'Inscrições', href: '#inscricoes-descontos' },
  { label: 'Programação', href: '#programacao' },
  {
    label: 'Seja um patrocinador',
    href: eventData.general.sponsorFormUrl,
    ...externalLink,
  },
  {
    label: 'Submissões de artigos',
    href: eventData.links.articleSubmission,
    ...externalLink,
  },
  {
    label: 'Instruções para submissão de artigo',
    href: eventData.links.articleInstructions,
    ...externalLink,
  },
  { label: 'Instruções para empenho', href: '#empenho' },
  { label: 'Guia IIIº CBDAS', href: '#guia-cbdas' },
];

const glassBandButtonClassName =
  'type-button w-full max-w-full whitespace-normal rounded-[16px] border-[#10224f]/18 bg-white/22 px-4 py-2.5 text-center text-[12.5px] leading-[1.15] tracking-[0.14em] text-[#10224f] shadow-[0_4px_14px_rgba(16,34,79,0.08)] backdrop-blur-md duration-200 hover:scale-[1.02] hover:border-[#081736] hover:bg-[#081736] hover:text-[#f8fafc] hover:shadow-[0_10px_24px_rgba(8,23,54,0.18)] active:scale-[0.99] active:border-[#081736] active:bg-[#081736] active:text-[#f8fafc] focus-visible:ring-[#10224f]/25 focus-visible:ring-offset-[#f9d600] sm:w-auto sm:px-[15px] sm:py-2 sm:text-[12.75px] lg:min-h-[36px] lg:px-3 lg:py-[7px] lg:text-[11px] lg:whitespace-nowrap xl:px-3.5 xl:text-[11.5px] 2xl:text-[12px]';

const mobileLongLabelButtonClassName =
  'min-h-[54px] px-3.5 py-3.5 text-[11px] leading-[1.22] tracking-[0.11em]';

const onCongressActionClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  onAfter?: () => void,
) => {
  handleInPageNavClick(event, href, onAfter);
};

export const CongressActionsBand = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <section
      aria-label="Acessos rápidos do congresso"
      className="relative overflow-hidden bg-[#f9d600] py-3 md:py-5"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.02)_36%,rgba(12,31,82,0.03)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/45" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#10224f]/12" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      >
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-multiply"
          style={{
            backgroundImage: `url(${elementosBrasilia})`,
            backgroundPosition: 'left center',
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            filter: 'grayscale(1) brightness(0.18) contrast(1.08) blur(0.45px)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.24] mix-blend-multiply"
          style={{
            backgroundImage: `url(${elementosBrasilia})`,
            backgroundPosition: 'left center',
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            filter: 'grayscale(1) brightness(0.06) contrast(1.04)',
          }}
        />
      </motion.div>

      <div className="relative mx-auto w-full max-w-[1620px] px-3 sm:px-4 lg:max-w-none lg:px-5 xl:px-6">
        <div className="relative z-10 md:hidden">
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-congress-actions-menu"
            aria-label={
              isMobileMenuOpen
                ? 'Fechar acessos rápidos do congresso'
                : 'Abrir acessos rápidos do congresso'
            }
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
            className="flex w-full items-center justify-center rounded-full px-3 py-1.5 text-[#10224f] transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10224f]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9d600]"
          >
            <span className="sr-only">Alternar acessos rápidos do congresso</span>
            <motion.span
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#10224f]/12 bg-white/18 shadow-[0_6px_16px_rgba(16,34,79,0.08)]"
            >
              <ChevronDown className="h-[18px] w-[18px]" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {isMobileMenuOpen ? (
              <motion.div
                id="mobile-congress-actions-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  exit={{ y: -8 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  className="mx-auto mt-3 flex max-w-[28rem] flex-col gap-2 border-t border-[#10224f]/10 pt-3"
                >
                  {congressActions.map((action) => (
                    <GlassButton
                      key={action.label}
                      asChild
                      variant="ghost"
                      className={`type-button min-h-[42px] w-full rounded-[16px] border border-[#10224f]/12 bg-white/24 px-4 py-3 text-center text-[12.5px] leading-[1.15] tracking-[0.14em] text-[#10224f] shadow-[0_4px_14px_rgba(16,34,79,0.08)] backdrop-blur-md duration-200 hover:scale-[1.01] hover:border-[#081736] hover:bg-[#081736] hover:text-[#f8fafc] hover:shadow-[0_10px_24px_rgba(8,23,54,0.18)] active:scale-[0.99] active:border-[#081736] active:bg-[#081736] active:text-[#f8fafc] focus-visible:ring-[#10224f]/25 focus-visible:ring-offset-[#f9d600] ${
                        action.label === 'Instruções para submissão de artigo'
                          ? mobileLongLabelButtonClassName
                          : ''
                      }`}
                    >
                      <a
                        href={action.href}
                        target={action.target}
                        rel={action.rel}
                        onClick={(event) => {
                          onCongressActionClick(event, action.href, () =>
                            setIsMobileMenuOpen(false),
                          );
                        }}
                        className={
                          action.label === 'Instruções para submissão de artigo'
                            ? 'w-full text-center [text-wrap:balance]'
                            : undefined
                        }
                      >
                        {action.label}
                      </a>
                    </GlassButton>
                  ))}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative z-10 mx-auto hidden max-w-full flex-wrap items-center justify-center gap-2 sm:gap-2.5 md:flex"
        >
          {congressActions.map((action) => (
            <GlassButton
              key={action.label}
              asChild
              variant="ghost"
              className={glassBandButtonClassName}
            >
              <a
                href={action.href}
                target={action.target}
                rel={action.rel}
                onClick={(event) => onCongressActionClick(event, action.href)}
              >
                {action.label}
              </a>
            </GlassButton>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
