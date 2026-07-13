import React from 'react';
import { motion } from 'motion/react';
import { CalendarRange, Percent } from 'lucide-react';
import { SectionTitle } from '../shared/SectionTitle';
import { CTAButton } from '../shared/CTAButton';
import { eventData } from '../../config/eventData';

export const RegistrationDiscounts = () => {
  const { registrationDiscounts, general } = eventData;

  return (
    <section
      id="inscricoes-descontos"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_48%,#f8fafc_100%)] py-20 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_top_right,rgba(249,214,0,0.14)_0%,transparent_42%),radial-gradient(circle_at_bottom_left,rgba(16,34,79,0.06)_0%,transparent_38%)]" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        <SectionTitle
          title={registrationDiscounts.title}
          subtitle={registrationDiscounts.subtitle}
          centered
        />

        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
          {registrationDiscounts.stages.map((stage, index) => (
            <motion.article
              key={stage.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(6,21,57,0.28)] md:p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="type-eyebrow inline-flex rounded-full border border-idasan-blue/12 bg-idasan-blue/5 px-3 py-1.5 text-idasan-blue">
                  {stage.title}
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-idasan-yellow/30 bg-idasan-yellow/15 text-idasan-blue">
                  <Percent className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>

              <div className="mb-4 flex items-start gap-3 text-slate-600">
                <CalendarRange className="mt-0.5 h-4 w-4 shrink-0 text-idasan-blue" aria-hidden="true" />
                <div>
                  <p className="type-eyebrow !text-[0.62rem] text-slate-500">Período</p>
                  <p className="type-body-sm mt-1 text-slate-800">{stage.period}</p>
                </div>
              </div>

              <div className="mt-auto border-t border-slate-100 pt-5">
                <p className="type-eyebrow !text-[0.62rem] text-slate-500">Benefício</p>
                <p className="type-card-title mt-2 text-idasan-blue">{stage.benefit}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-10 flex justify-center"
        >
          <CTAButton
            href={general.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="w-full sm:w-auto"
            ariaLabel="Inscreva-se no IIIº CBDAS na Eventweb"
          >
            {registrationDiscounts.ctaLabel}
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
};
