import React from 'react';
import { Instagram, Linkedin, Youtube, Mail, ExternalLink } from 'lucide-react';
import { eventData } from '../../config/eventData';
import centoeonzeLogo from '../../assets/centoeonzelogo.png';
import darkLogo from '../../assets/logodark.webp';

export const Contact = () => {
  return (
    <footer id="contato" className="bg-gray-900 text-white pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <img
              src={darkLogo}
              alt="IIIº CBDAS"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              width={204}
              height={160}
              className="mb-6 h-[44px] w-auto object-contain sm:h-[52px]"
            />
            <p className="type-body-sm mb-6 text-gray-400">
              O principal fórum nacional dedicado ao estudo, debate e desenvolvimento do Direito Administrativo Sancionador.
            </p>
            <div className="flex gap-4">
              <a href={eventData.links.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-idasan-yellow transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={eventData.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-idasan-yellow transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={eventData.links.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-idasan-yellow transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="type-eyebrow mb-6 text-gray-500">Links Rápidos</h4>
            <ul className="type-body-sm space-y-3 text-gray-300">
              <li><a href="#inscricoes" className="hover:text-idasan-yellow transition-colors">Inscrições</a></li>
              <li><a href="#programacao" className="hover:text-idasan-yellow transition-colors">Programação</a></li>
              <li><a href="#oficinas" className="hover:text-idasan-yellow transition-colors">Oficinas</a></li>
              <li><a href="#local" className="hover:text-idasan-yellow transition-colors">Local</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="type-eyebrow mb-6 text-gray-500">Contato</h4>
            <ul className="type-body-sm space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-idasan-yellow" />
                <a href={`mailto:${eventData.links.email}`} className="hover:text-white transition-colors">{eventData.links.email}</a>
              </li>
              <li className="pt-4 border-t border-white/10 mt-4">
                <a href={eventData.links.ii_cbdas} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-idasan-yellow transition-colors">
                  Acesse o IIº CBDAS <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href={eventData.links.i_cbdas} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-idasan-yellow transition-colors">
                  Acesse o I CBDAS <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="type-body-xs flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-gray-500 md:flex-row">
          <p>&copy; 2026 IDASAN. Todos os direitos reservados.</p>
          <p className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            <span>Desenvolvido por</span>
            <a
              href="https://centoeonze.space/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar site da Cento e Onze"
              className="inline-flex items-center"
            >
              <img
                src={centoeonzeLogo}
                alt="centoeonze"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                width={200}
                height={27}
                className="h-4 w-auto object-contain align-middle sm:h-[18px]"
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
