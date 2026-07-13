import React from 'react';
import { motion } from 'motion/react';

interface SectionTitleProps {
  title: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  eyebrow?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  titleClassName = '',
  subtitle, 
  subtitleClassName = '',
  eyebrow,
  centered = false, 
  light = false,
  className = ""
}) => {
  return (
    <div className={`mb-12 flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className={`type-eyebrow mb-4 ${light ? 'text-white/68' : 'text-slate-500'}`}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`type-display-title ${light ? 'text-white' : 'text-idasan-blue'} ${titleClassName}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`type-subtitle mt-4 max-w-3xl ${light ? 'text-white/82' : 'text-slate-700'} ${subtitleClassName}`}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: subtitle ? 0.16 : 0.08 }}
        className="mt-5 h-[2px] w-20 rounded-full bg-idasan-yellow/90"
      />
    </div>
  );
};
