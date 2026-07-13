import React, { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { SectionTitle } from '../shared/SectionTitle';
import { CTAButton } from '../shared/CTAButton';
import { eventData } from '../../config/eventData';
import { WorkshopCard, type WorkshopCardView } from './WorkshopCard';

const workshopGroupsView = eventData.workshops.map((dayGroup) => ({
  id: dayGroup.day,
  day: dayGroup.day,
  items: [...dayGroup.items]
    .sort((a, b) => a.order - b.order)
    .map<WorkshopCardView>((workshop) => ({
      id: `${dayGroup.day}-${workshop.time}-${workshop.title}`,
      time: workshop.time,
      title: workshop.title,
      participants: workshop.participants,
    })),
}));

export const Workshops = memo(() => {
  const workshopGroups = useMemo(() => workshopGroupsView, []);

  return (
    <section id="oficinas" className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <SectionTitle title="Oficinas Temáticas" subtitle="Aprofundamento Prático" className="mb-0" />
          <div className="hidden md:block">
            <CTAButton href="#inscricoes" variant="secondary" className="text-sm">
              Garantir Vaga
            </CTAButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {workshopGroups.map((dayGroup, groupIndex) => (
            <motion.div
              key={dayGroup.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.28, delay: groupIndex * 0.04, ease: 'easeOut' }}
              className="space-y-6"
            >
              <h3 className="type-card-title border-b border-gray-200 pb-4 text-idasan-blue">
                {dayGroup.day}
              </h3>
              
              {dayGroup.items.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <CTAButton href="#inscricoes" variant="secondary" fullWidth>
            Garantir Vaga
          </CTAButton>
        </div>
      </div>
    </section>
  );
});

Workshops.displayName = 'Workshops';
