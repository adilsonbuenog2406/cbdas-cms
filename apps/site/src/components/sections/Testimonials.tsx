import { memo, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { SectionTitle } from '../shared/SectionTitle';

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      'O congresso conseguiu unir profundidade técnica, pluralidade institucional e uma curadoria rara no debate sobre o DAS.',
    name: 'Adriana Menezes',
    role: 'Procuradora do Estado',
  },
  {
    quote:
      'Saio do CBDAS com repertório prático, novas referências acadêmicas e contatos que certamente vão repercutir no meu trabalho.',
    name: 'Bruno Vasconcelos',
    role: 'Advogado Publicista',
  },
  {
    quote:
      'A organização foi precisa do início ao fim. O ambiente favorece discussão qualificada sem perder acolhimento e fluidez.',
    name: 'Camila Tavares',
    role: 'Professora de Direito Administrativo',
  },
  {
    quote:
      'Foi um dos encontros mais consistentes que acompanhei nos últimos anos sobre processo administrativo sancionador.',
    name: 'Daniel Ribeiro',
    role: 'Consultor em Regulacao',
  },
  {
    quote:
      'A densidade técnica dos painéis chama atenção, mas o que mais impressiona é a capacidade de traduzir teoria em prática.',
    name: 'Elisa Fagundes',
    role: 'Coordenadora de Compliance Publico',
  },
  {
    quote:
      'O evento se consolidou como espaço de referência para quem atua com controle, integridade e responsabilização administrativa.',
    name: 'Fernando Paiva',
    role: 'Auditor de Controle Externo',
  },
  {
    quote:
      'Há uma clara preocupação com a diversidade de perspectivas, e isso eleva muito o nível das discussões ao longo de toda a programação.',
    name: 'Gabriela Mourao',
    role: 'Pesquisadora em Politicas Publicas',
  },
  {
    quote:
      'O CBDAS entrega um recorte muito atual da agenda sancionadora brasileira, sem perder rigor metodológico e institucional.',
    name: 'Henrique Lobo',
    role: 'Professor e Parecerista',
  },
  {
    quote:
      'Participar do congresso me ajudou a reposicionar temas sensíveis do contencioso administrativo com muito mais clareza.',
    name: 'Isabela Cunha',
    role: 'Advogada Especialista em DAS',
  },
  {
    quote:
      'A curadoria é sofisticada, os palestrantes são excelentes, e a experiência de ponta a ponta transmite a sensação de um evento premium.',
    name: 'Joao Vicente Prado',
    role: 'Diretor Juridico',
  },
  {
    quote:
      'O encontro valoriza o debate sério e evita superficialidade. É exatamente o tipo de ambiente de que o setor precisava.',
    name: 'Karina Monteiro',
    role: 'Assessora de Tribunal de Contas',
  },
  {
    quote:
      'Foi uma experiência intelectual muito rica, com mesas que realmente dialogam com os dilemas enfrentados no dia a dia.',
    name: 'Larissa Andrade',
    role: 'Procuradora Municipal',
  },
  {
    quote:
      'Os painéis conseguiram articular jurisprudência, legislação e governança com um grau de profundidade difícil de encontrar.',
    name: 'Marcelo Pires',
    role: 'Consultor Legislativo',
  },
  {
    quote:
      'A atmosfera do congresso transmite seriedade institucional e, ao mesmo tempo, cria espaço genuíno para a conexão entre profissionais.',
    name: 'Natalia Rocha',
    role: 'Especialista em Integridade',
  },
  {
    quote:
      'Voltei com anotações valiosas sobre dosimetria, garantias processuais e desenho de mecanismos preventivos.',
    name: 'Otavio Serra',
    role: 'Servidor Federal',
  },
  {
    quote:
      'A qualidade das conferências e a organização impecável fazem o CBDAS parecer um evento de referência internacional.',
    name: 'Patricia Freire',
    role: 'Professora Universitaria',
  },
  {
    quote:
      'Os debates foram maduros, plurais e extremamente bem mediados. Um congresso que realmente agrega conteúdo e relações institucionais.',
    name: 'Rafael Barcellos',
    role: 'Advogado e Arbitralista',
  },
  {
    quote:
      'A seleção de temas mostra sensibilidade para os desafios contemporâneos do poder sancionador e da boa administração.',
    name: 'Renata Siqueira',
    role: 'Pesquisadora em Governanca',
  },
  {
    quote:
      'O CBDAS se tornou um ponto de encontro obrigatório para quem quer acompanhar a evolução do Direito Administrativo Sancionador.',
    name: 'Ricardo Valente',
    role: 'Conselheiro de Autarquia',
  },
  {
    quote:
      'O nível das trocas informais nos intervalos é tão relevante quanto o conteúdo dos painéis. Há muito capital intelectual circulando.',
    name: 'Sabrina Queiroz',
    role: 'Gerente de Riscos e Controles',
  },
  {
    quote:
      'A cada edição, fica mais claro que o evento amadureceu como plataforma institucional de alto prestígio.',
    name: 'Tatiana Leal',
    role: 'Advogada da Uniao',
  },
  {
    quote:
      'Os depoimentos dos palestrantes e participantes mostram como o congresso influencia a prática profissional e a formulação institucional.',
    name: 'Thiago Nascimento',
    role: 'Coordenador de Contencioso Administrativo',
  },
  {
    quote:
      'O formato favorece aprendizado real, networking qualificado e uma leitura muito atualizada das tensões entre controle e segurança jurídica.',
    name: 'Valeria Soares',
    role: 'Diretora de Compliance',
  },
  {
    quote:
      'Raramente vejo um evento combinar tão bem excelência acadêmica, aplicação prática e cuidado com a experiência do participante.',
    name: 'Victor Teixeira',
    role: 'Professor e Consultor',
  },
  {
    quote:
      'O CBDAS ajudou a aproximar diferentes instituições em torno de uma agenda comum de aprimoramento do sistema sancionador.',
    name: 'Viviane Porto',
    role: 'Procuradora Federal',
  },
  {
    quote:
      'A programação demonstra conhecimento profundo da matéria e compromisso real com a qualidade do debate público.',
    name: 'William Farias',
    role: 'Assessor Juridico',
  },
  {
    quote:
      'Mesmo para quem já atua na área há anos, o congresso oferece repertório novo, benchmarks e leituras muito refinadas.',
    name: 'Yasmin Dantas',
    role: 'Especialista em Processo Administrativo',
  },
] as const;

const testimonialRows = [
  {
    items: testimonials.slice(0, 14),
    duration: '75.6s',
    delay: '-32s',
  },
  {
    items: testimonials.slice(14),
    duration: '88.2s',
    delay: '-44s',
  },
] as const;

const cardWidthVariants = [
  'w-[clamp(16rem,74vw,18.5rem)] sm:w-[clamp(18rem,43vw,20.5rem)] lg:w-[clamp(19.5rem,29vw,22rem)]',
  'w-[clamp(16.75rem,76vw,19.5rem)] sm:w-[clamp(18.75rem,45vw,21.5rem)] lg:w-[clamp(20rem,30vw,23.25rem)]',
  'w-[clamp(17.25rem,78vw,20.25rem)] sm:w-[clamp(19.25rem,46vw,22rem)] lg:w-[clamp(20.5rem,31vw,23.75rem)]',
] as const;

const MARQUEE_COPIES = [0, 1] as const;

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <article
      className={`testimonial-card group relative flex h-full min-h-[clamp(10.08rem,30.24vw,11.16rem)] shrink-0 flex-col overflow-hidden rounded-[24px] border border-white/14 bg-white/[0.08] p-4 shadow-[0_22px_56px_-40px_rgba(4,8,20,0.72)] transition-transform duration-500 hover:-translate-y-1 hover:bg-white/[0.11] sm:min-h-[clamp(10.8rem,23.04vw,11.88rem)] sm:p-5 lg:rounded-[28px] lg:p-6 lg:shadow-[0_26px_70px_-42px_rgba(4,8,20,0.78)] ${cardWidthVariants[index % cardWidthVariants.length]}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_18%,transparent_100%)]" />
      <div className="pointer-events-none absolute -right-4 top-1 h-14 w-14 rounded-full bg-white/14 blur-2xl sm:-right-5 sm:top-0 sm:h-16 sm:w-16 sm:blur-[42px] lg:-right-6 lg:h-20 lg:w-20 lg:blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-4 h-10 w-10 rounded-full bg-idasan-yellow/10 blur-xl sm:left-5 sm:h-12 sm:w-12 sm:blur-2xl lg:left-6 lg:h-16 lg:w-16" />
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-white/0 via-white/55 to-white/0 sm:inset-x-5" />

      <div className="relative flex h-full flex-col items-center text-center">
        <div className="flex w-full justify-start">
          <Quote className="h-7 w-7 shrink-0 text-idasan-yellow/88 sm:h-8 sm:w-8" />
        </div>

        <p className="type-body-sm mt-4 flex flex-1 items-center text-center text-sm leading-7 text-white/90 sm:mt-5 sm:text-[0.98rem]">
          "{testimonial.quote}"
        </p>
      </div>
    </article>
  );
});

const TestimonialMarqueeRow = memo(function TestimonialMarqueeRow({
  items,
  duration,
  delay,
}: {
  items: readonly Testimonial[];
  duration: string;
  delay: string;
}) {
  return (
    <div className="testimonial-marquee-row" aria-hidden="true">
      <div
        className="testimonial-marquee-track"
        style={
          {
            '--marquee-duration': duration,
            '--marquee-delay': delay,
          } as CSSProperties
        }
      >
        {MARQUEE_COPIES.map((copyIndex) => (
          <div key={copyIndex} className="testimonial-marquee-group">
            {items.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${copyIndex}`}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export const Testimonials = memo(function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-idasan-blue py-[4.5rem] sm:py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(249,214,0,0.1)_0%,transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_28%,rgba(255,255,255,0.02)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[96rem] px-4 sm:px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <SectionTitle title="O que dizem sobre o CBDAS" light centered />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.82, ease: 'easeOut', delay: 0.08 }}
          className="relative left-1/2 right-1/2 mt-8 w-screen -translate-x-1/2 space-y-3 sm:mt-10 sm:space-y-4 lg:space-y-5"
        >
          {testimonialRows.map((row) => (
            <TestimonialMarqueeRow
              key={row.duration}
              items={row.items}
              duration={row.duration}
              delay={row.delay}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
});
