import React from 'react';
import { speakers } from '../../data/speakers';
import { SpeakerCard } from '../speakers/SpeakerCard';

export const SpeakersSection = () => {
  return (
    <section id="palestrantes" className="relative overflow-hidden bg-[#eef4fb] py-24 md:py-28 xl:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 bg-[radial-gradient(circle,_rgba(220,235,255,0.62)_0%,_rgba(220,235,255,0.34)_34%,_rgba(207,226,255,0.14)_54%,_transparent_72%)]" />
        <div className="absolute right-0 top-24 h-96 w-96 bg-[radial-gradient(circle,_rgba(28,39,81,0.1)_0%,_transparent_72%)]" />
        <div className="absolute bottom-0 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 bg-[radial-gradient(circle,_rgba(12,31,82,0.08)_0%,_transparent_72%)]" />
      </div>

      <div className="relative mx-auto max-w-[96rem] px-4 md:px-5 lg:px-6">
        <header className="mx-auto max-w-3xl text-center">
          <span className="type-eyebrow inline-flex items-center gap-3 text-slate-500">
            <span className="h-px w-10 bg-slate-300" />
            IIIº CBDAS
            <span className="h-px w-10 bg-slate-300" />
          </span>

          <h2 className="type-display-title mt-5 text-idasan-navy-900">Palestrantes Confirmados</h2>

        </header>

        <div className="mt-14 pb-4 md:overflow-x-auto">
          <div
            className="grid grid-cols-1 gap-6 md:mx-auto md:w-[78rem] md:max-w-none md:grid-cols-4"
            role="list"
            aria-label="Lista de palestrantes confirmados"
          >
            {speakers.map((speaker, index) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                index={index}
                container={null}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
