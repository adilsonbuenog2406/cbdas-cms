import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionTitle } from '../shared/SectionTitle';
import { eventData } from '../../config/eventData';
import idasanLogo from '../../assets/logocoloridasemfundo.png';
import congressArtwork from '../../assets/congress.png';

const congressRevealTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const Institution = () => {
  return (
    <section className="relative overflow-hidden bg-idasan-gray py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionTitle title="Realização" centered className="mb-8" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white px-6 py-8 shadow-[0_30px_80px_-48px_rgba(6,21,57,0.38)] sm:px-8 sm:py-10 md:px-12 md:py-14"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <div className="mb-8 flex flex-col items-center gap-4 md:gap-5">
                <div className="flex h-[58px] w-[88px] items-center justify-center overflow-hidden sm:h-[70px] sm:w-[104px] md:h-[82px] md:w-[122px]">
                  <img
                    src={idasanLogo}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    width={656}
                    height={380}
                    className="h-full w-full flex-none object-contain object-center"
                  />
                </div>

                <span className="type-card-title text-idasan-blue uppercase tracking-[0.22em] sm:!text-[2rem] md:!text-[2.15rem]">
                  IDASAN
                </span>
              </div>

              <p className="type-body mb-8 text-gray-600">
                {eventData.institution.text}
              </p>

              <a 
                href={eventData.general.idasanSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-button relative z-10 inline-flex items-center gap-2 text-idasan-blue transition-colors group hover:text-idasan-yellow"
              >
                Acesse o site do IDASAN
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 28, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={congressRevealTransition}
              className="pointer-events-none absolute -bottom-4 -right-10 w-[132px] max-w-[46vw] sm:-bottom-5 sm:-right-8 sm:w-[170px] md:-bottom-6 md:-right-10 md:w-[230px] lg:w-[290px]"
            >
              <img
                src={congressArtwork}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                width={711}
                height={351}
                className="w-full brightness-0 opacity-[0.18] sm:opacity-[0.22] md:opacity-[0.3]"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
