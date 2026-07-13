import React from 'react';
import { motion } from 'motion/react';
import { FileText, FolderOpen } from 'lucide-react';
import { SectionTitle } from '../shared/SectionTitle';
import { CTAButton } from '../shared/CTAButton';
import { eventData } from '../../config/eventData';

export const ArticleSubmissionAccess = () => {
  const { links } = eventData;

  return (
    <section id="artigos-cientificos" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-idasan-blue">
            <FileText className="h-8 w-8" aria-hidden="true" />
          </div>

          <SectionTitle
            title="Artigos Científicos"
            subtitle="Submissão de trabalhos para o IIIº CBDAS"
            centered
            className="mb-8"
          />

          <p className="type-body mx-auto mb-10 max-w-2xl text-slate-600">
            Acesse a plataforma de submissões ou consulte as instruções completas para envio de artigos
            científicos ao IIIº Congresso Brasileiro de Direito Administrativo Sancionador.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <CTAButton
              href={links.articleSubmission}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="w-full sm:w-auto"
              ariaLabel="Abrir submissões de artigos na Eventweb"
            >
              Submissões de artigos
            </CTAButton>

            <CTAButton
              href={links.articleInstructions}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              icon={false}
              className="w-full sm:w-auto"
              ariaLabel="Abrir instruções para submissão de artigo no Google Drive"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <FolderOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                Instruções para submissão de artigo
              </span>
            </CTAButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
