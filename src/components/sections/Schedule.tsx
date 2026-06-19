import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { motion } from 'motion/react';
import { SectionTitle } from '../shared/SectionTitle';
import { eventData, type ScheduleEventType } from '../../config/eventData';
import { ScheduleCard, type ScheduleCardView } from './ScheduleCard';
import estatuajustica from '../../assets/estatuajustica.png';

const scheduleTypeLabel: Record<ScheduleEventType, string> = {
  panel: 'Painel',
  conference: 'Conferência',
  ceremony: 'Cerimônia',
  special: 'Especial',
  service: 'Atividade',
  break: 'Intervalo',
};

const formatScheduleTime = (value: string) =>
  value
    .toUpperCase()
    .replace(/\s*[-–]\s*/g, ' – ');

const scheduleAccentClassName: Record<ScheduleEventType, string> = {
  panel: 'border-idasan-blue',
  conference: 'border-idasan-blue',
  ceremony: 'border-idasan-blue',
  special: 'border-purple-500',
  service: 'border-idasan-blue',
  break: 'border-idasan-yellow bg-yellow-50/30',
};

const scheduleDaysView = eventData.schedule.map((day) => ({
  id: `${day.date}-${day.title}`,
  date: day.date,
  title: day.title,
  events: day.events.map<ScheduleCardView>((event) => ({
    id: `${day.date}-${event.time}-${event.title}`,
    title: event.title,
    formattedTime: formatScheduleTime(event.time),
    type: event.type,
    typeLabel: event.type === 'break' ? null : (scheduleTypeLabel[event.type] ?? 'Atividade'),
    accentClassName: scheduleAccentClassName[event.type],
    speakers: event.speakers,
  })),
}));

export const Schedule = () => {
  const [activeDay, setActiveDay] = useState(0);
  const [, startTransition] = useTransition();
  const scheduleDays = useMemo(() => scheduleDaysView, []);
  const activeScheduleDay = useMemo(() => scheduleDays[activeDay], [activeDay, scheduleDays]);

  const handleDayChange = useCallback((nextDay: number) => {
    startTransition(() => {
      setActiveDay((currentDay) => (currentDay === nextDay ? currentDay : nextDay));
    });
  }, []);

  return (
    <section id="programacao" className="relative overflow-hidden bg-gray-50 py-16 md:py-24">
      <div className="pointer-events-none absolute -left-10 top-[-1.5rem] hidden h-[18rem] w-[18rem] bg-[radial-gradient(circle_at_top_left,_rgba(249,214,0,0.14)_0%,rgba(249,214,0,0.07)_34%,rgba(16,36,95,0.04)_60%,transparent_78%)] md:block lg:h-[22rem] lg:w-[24rem] xl:h-[26rem] xl:w-[28rem]" />
      <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[14rem] w-[16rem] bg-[radial-gradient(circle_at_bottom_right,_rgba(16,36,95,0.12)_0%,transparent_70%)] lg:block xl:h-[18rem] xl:w-[20rem]" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Programação"
          titleClassName="schedule-title-montserrat-black !tracking-[-0.025em] !leading-[1.28]"
          subtitle="Agenda Completa"
          subtitleClassName="!text-[clamp(1.15rem,1.0925rem+0.391vw,1.472rem)]"
          centered
          className="mb-9 md:mb-10"
        />

        <div className="relative mx-auto max-w-[72rem]">
          {/* Tabs */}
          <div className="mb-8 flex justify-center md:mb-9">
            <div className="inline-flex rounded-full bg-white p-[3px] shadow-sm">
              {scheduleDays.map((day, index) => (
                <button
                  key={day.id}
                  onClick={() => handleDayChange(index)}
                  className={`rounded-full px-5 py-2.5 transition-all duration-300 md:px-6 ${
                    activeDay === index
                      ? 'bg-idasan-blue text-white shadow-md'
                      : 'text-gray-500 hover:text-idasan-blue'
                  }`}
                >
                  <span className="type-eyebrow block !text-[0.58rem] opacity-70">{day.date}</span>
                  <span className="type-card-title mt-0.5 block !text-[0.9rem] md:!text-[0.96rem]">
                    {day.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto min-h-[440px] max-w-[42rem] md:min-h-[480px]">
            <motion.div
              key={activeScheduleDay.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="space-y-4"
            >
              {activeScheduleDay.events.map((event) => (
                <ScheduleCard key={event.id} event={event} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block">
        <div className="container relative mx-auto h-0 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.14 }}
            className="absolute -bottom-6 -right-28 w-[28rem] xl:-bottom-8 xl:-right-36 xl:w-[32.2rem] 2xl:-right-40 2xl:w-[36.4rem]"
          >
            <div className="relative">
              <img
                src={estatuajustica}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                width={1820}
                height={1028}
                className="relative h-auto w-full object-contain opacity-[0.46] mix-blend-multiply"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
