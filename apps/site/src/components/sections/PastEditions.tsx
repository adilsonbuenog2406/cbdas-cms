import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Camera } from 'lucide-react';
import { SectionTitle } from '../shared/SectionTitle';
import { GlassCard } from '../shared/GlassCard';
import { eventData } from '../../config/eventData';

const imagePositionByEdition: Record<string, string> = {
  'i-cbdas': 'center 28%',
  'ii-cbdas': 'center 24%',
};

export const PastEditions = () => {
  return (
    <section className="py-20 md:py-32 bg-idasan-blue relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#151e3f] to-transparent opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionTitle
          title="Edições Anteriores"
          titleClassName="past-editions-title-montserrat-black"
          subtitle="Nossa História"
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {eventData.pastEditions.map((edition, index) => (
            <motion.div
              key={edition.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <GlassCard dark hoverEffect className="h-full flex flex-col overflow-hidden group">
                {/* Image Area */}
                <div className="relative h-52 overflow-hidden rounded-t-lg -mx-6 -mt-6 mb-6 sm:h-56 lg:h-[15rem]">
                  <div className="absolute inset-0 bg-gradient-to-t from-idasan-blue to-transparent opacity-60 z-10" />
                  <img 
                    src={edition.image} 
                    alt={edition.title}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{
                      objectPosition: imagePositionByEdition[edition.id] ?? 'center center',
                    }}
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="type-card-title !text-[1.45rem] text-white">{edition.title}</h3>
                    <p className="type-eyebrow mt-2 text-idasan-yellow">{edition.subtitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <p className="type-body-sm mb-6 text-gray-300">
                    {edition.description}
                  </p>

                  {edition.details.length > 0 && (
                    <div className="space-y-2 mb-6 border-t border-white/10 pt-4">
                      {edition.details.map((detail, idx) => (
                        <div key={idx}>
                          <span className="type-eyebrow block mb-1 !text-[0.62rem] text-gray-400">{detail.label}</span>
                          <span className="type-body-xs text-white">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
                  <a 
                    href={edition.links.more}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-button flex items-center gap-2 text-white transition-colors hover:text-idasan-yellow"
                  >
                    Saiba mais <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href={edition.links.records}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-button ml-auto flex items-center gap-2 text-white transition-colors hover:text-idasan-yellow"
                  >
                    Confira os registros <Camera className="w-3 h-3" />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
