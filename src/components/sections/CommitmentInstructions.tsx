import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, CheckCircle, FileText } from 'lucide-react';
import { SectionTitle } from '../shared/SectionTitle';
import { eventData } from '../../config/eventData';

export const CommitmentInstructions = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const DataRow = ({ label, value, copyValue }: { label: string, value: string, copyValue?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-idasan-blue/30 transition-colors group">
      <span className="type-eyebrow mb-1 text-gray-500 sm:mb-0">{label}</span>
      <div className="flex items-center gap-3">
        <span className="type-body-sm text-right text-gray-900 break-all sm:break-normal">{value}</span>
        <button 
          onClick={() => handleCopy(copyValue || value, label)}
          className="p-2 text-gray-400 hover:text-idasan-blue hover:bg-blue-50 rounded-full transition-all"
          title="Copiar"
        >
          {copiedField === label ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <section id="empenho" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <SectionTitle
            title="Instruções para Empenho"
            subtitle="Dados Institucionais"
            centered
            className="[&_h2]:whitespace-nowrap [&_h2]:text-[1.36rem] [&_h2]:leading-[1] [&_h2]:tracking-[0.002em] [&_h2]:[text-wrap:nowrap] sm:[&_h2]:text-[clamp(1.52rem,2.48vw,2.76rem)] sm:[&_h2]:leading-[0.94] sm:[&_h2]:tracking-[0.008em] sm:[&_h2]:whitespace-normal sm:[&_h2]:[text-wrap:balance]"
          />
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-idasan-blue p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6 text-idasan-yellow" />
                <h3 className="type-card-title !text-[1.25rem] text-white">Dados para Nota de Empenho</h3>
              </div>
              <p className="type-body-sm text-white/70">
                Utilize os dados abaixo para emissão de nota de empenho. O valor deve seguir o prazo estabelecido em cada lote.
              </p>
            </div>
            
            <div className="p-6 md:p-8 space-y-4">
              <DataRow label="Razão Social" value={eventData.commitment.companyName} />
              <DataRow label="CNPJ" value={eventData.commitment.cnpj} />
              <DataRow label="Sede" value={eventData.commitment.address} />
              <DataRow label="Dados Bancários" value={eventData.commitment.bankDetails} />
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="type-body-sm text-blue-800">
                  <strong>Certidões e Declarações:</strong> Acesse a pasta completa com toda a documentação necessária.
                </div>
                <a 
                  href={eventData.commitment.docsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-button whitespace-nowrap rounded-lg border border-blue-200 bg-white px-4 py-2 text-blue-700 shadow-sm hover:shadow"
                >
                  Acessar Documentos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
