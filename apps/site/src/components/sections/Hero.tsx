import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import { eventData } from '../../config/eventData';
import heroAsset from '../../assets/heroasset.png';
import { CTAButton } from '../shared/CTAButton';
import { PremiumHeroBackground } from '../shared/PremiumHeroBackground';

const heroTypewriterMessages = [
  'Em Brasília de 20 a 21 de agosto de 2026',
  'IIIº Congresso Brasileiro de Direito Administrativo Sancionador',
] as const;

type TypewriterPhase = 'typing' | 'holding' | 'deleting';

const getTypingDelay = (nextCharacter: string) => {
  if (nextCharacter === ':') {
    return 80;
  }

  if (nextCharacter === ' ') {
    return 24;
  }

  return 34;
};

const AnimatedHeroSubtitle = () => {
  const prefersReducedMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<TypewriterPhase>('typing');

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const currentMessage = heroTypewriterMessages[messageIndex];
    let timeoutId: number;

    if (phase === 'typing') {
      if (displayText.length < currentMessage.length) {
        const nextCharacter = currentMessage[displayText.length];
        timeoutId = window.setTimeout(() => {
          setDisplayText(currentMessage.slice(0, displayText.length + 1));
        }, getTypingDelay(nextCharacter));
      } else {
        timeoutId = window.setTimeout(() => {
          setPhase('holding');
        }, 1400);
      }
    } else if (phase === 'holding') {
      timeoutId = window.setTimeout(() => {
        setPhase('deleting');
      }, 220);
    } else if (displayText.length > 0) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(currentMessage.slice(0, displayText.length - 1));
      }, 18);
    } else {
      timeoutId = window.setTimeout(() => {
        setMessageIndex((currentIndex) => (currentIndex + 1) % heroTypewriterMessages.length);
        setPhase('typing');
      }, 220);
    }

    return () => window.clearTimeout(timeoutId);
  }, [displayText, messageIndex, phase, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="relative mx-auto min-h-[3.5rem] max-w-4xl type-subtitle text-white/74 sm:min-h-[2.9rem]">
        <p className="flex min-h-[inherit] items-center justify-center text-center">
          {heroTypewriterMessages[0]}
        </p>
        <span className="sr-only">
          Em Brasília de 20 a 21 de agosto de 2026. IIIº Congresso Brasileiro de Direito
          Administrativo Sancionador.
        </span>
      </div>
    );
  }

  const showCursor = true;

  return (
    <div className="relative mx-auto min-h-[3.5rem] max-w-4xl type-subtitle text-white/74 sm:min-h-[2.9rem]">
      <p aria-hidden="true" className="invisible select-none">
        {heroTypewriterMessages[0]}
      </p>
      <p className="absolute inset-0 flex items-center justify-center text-center">
        <span>{displayText}</span>
        <motion.span
          aria-hidden="true"
          className="ml-1 inline-block h-[1.1em] w-px rounded-full bg-idasan-yellow/85"
          animate={showCursor ? { opacity: [0.22, 1, 0.22] } : { opacity: 0 }}
          transition={
            showCursor
              ? { duration: 1.05, ease: 'easeInOut', repeat: Infinity }
              : { duration: 0.35, ease: 'easeOut' }
          }
        />
      </p>
      <span className="sr-only">
        Em Brasília de 20 a 21 de agosto de 2026. IIIº Congresso Brasileiro de Direito Administrativo
        Sancionador.
      </span>
    </div>
  );
};

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#061539] pt-20">
      <PremiumHeroBackground />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Pre-title / Date & Location */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8 text-white/80"
          >
            <div className="type-eyebrow flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 !text-[0.74rem] !tracking-[0.18em] backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-idasan-yellow" />
              <span>{eventData.general.date}</span>
            </div>
            <div className="type-eyebrow flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 !text-[0.74rem] !tracking-[0.18em] backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-idasan-yellow" />
              <span>Brasília - DF</span>
            </div>
          </motion.div>

          <h1 className="sr-only">{eventData.general.shortTitle}</h1>

          {/* Hero artwork */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 mt-4"
          >
            <img
              src={heroAsset}
              alt={`Arte oficial do ${eventData.general.shortTitle}`}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width={745}
              height={335}
              className="mx-auto h-auto w-full max-w-xl md:max-w-2xl lg:max-w-3xl"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-idasan-yellow to-transparent mx-auto mb-6"
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-10"
          >
            <AnimatedHeroSubtitle />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <CTAButton
              href={eventData.general.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="gold"
              className="w-full sm:w-auto"
              ariaLabel="Inscreva-se no IIIº CBDAS na Eventweb"
            >
              Inscreva-se Agora
            </CTAButton>

            <div className="flex w-full max-w-2xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <CTAButton
                href={eventData.links.articleSubmission}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="w-full sm:flex-1 sm:min-w-[14rem]"
                ariaLabel="Abrir submissões de artigos na Eventweb"
              >
                Submissões de artigos
              </CTAButton>
              <CTAButton
                href={eventData.links.articleInstructions}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                icon={false}
                className="w-full sm:flex-1 sm:min-w-[14rem]"
                ariaLabel="Abrir instruções para submissão de artigo no Google Drive"
              >
                Instruções para submissão de artigo
              </CTAButton>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
