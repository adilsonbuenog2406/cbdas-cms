import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { SectionTitle } from '../shared/SectionTitle';
import { eventData } from '../../config/eventData';
import { CTAButton } from '../shared/CTAButton';
import brasiliaPhoto from '../../assets/brasilia.jpeg';

export const Location = () => {
  const mapsDirectionsUrl = 'https://maps.app.goo.gl/Sx1Rs9kcHU18QSbo9';
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    `${eventData.general.location}, ${eventData.general.fullAddress}`,
  )}&z=16&output=embed`;

  return (
    <section id="local" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle title="Local do Evento" subtitle="Brasília - DF" />
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="type-card-title mb-4 text-idasan-blue">
                {eventData.general.location}
              </h3>
              <p className="type-body mb-8 flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-idasan-yellow mt-1 flex-shrink-0" />
                {eventData.general.fullAddress}
              </p>
              
              <CTAButton
                href={mapsDirectionsUrl}
                variant="secondary"
                icon
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={`Abrir rota para ${eventData.general.location} no Google Maps em nova aba`}
              >
                Como Chegar
              </CTAButton>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] lg:h-[430px]"
          >
            <div className="relative h-full overflow-hidden rounded-[28px] border border-white/70 bg-gray-200 shadow-[0_28px_56px_-40px_rgba(6,21,57,0.45)]">
              <iframe
                src={mapsEmbedUrl}
                title={`Mapa do Google Maps mostrando ${eventData.general.location} em Brasília`}
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="pointer-events-none absolute bottom-4 right-4 z-10 w-[12.9rem] rounded-[22px] border border-white/80 bg-white/92 p-2 shadow-[0_24px_50px_-24px_rgba(6,21,57,0.4)] backdrop-blur sm:w-[15.7rem] md:w-[17.2rem] lg:-bottom-5 lg:-right-5">
              <img
                src={brasiliaPhoto}
                alt="Vista de Brasília"
                loading="lazy"
                decoding="async"
                className="h-[8.6rem] w-full rounded-[16px] object-cover sm:h-[10rem] md:h-[11.4rem]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
