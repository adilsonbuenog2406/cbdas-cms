import { Fragment } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import { eventData } from '../../config/eventData';
import amigasConversando from '../../assets/amigasconversando.webp';
import elementosBrasilia from '../../assets/elementosbrasilia.png';
import idasanPalcoSampa from '../../assets/idasanpalcosampa.webp';
import idasanSampa from '../../assets/idasansampa.webp';
import plateiaIdasan from '../../assets/plateiaidasan.webp';
import sampaIdasanGente from '../../assets/sampaidasangente.webp';
import idasanVertical from '../../assets/16.JPG';

type CongressGalleryItem = {
  id: string;
  alt: string;
  className: string;
  eyebrow: string;
  title?: string;
  src: string;
  objectPosition?: string;
  showBadge?: boolean;
  showOverlay?: boolean;
};

type CongressGalleryImageProps = CongressGalleryItem & {
  index: number;
};

const congressGalleryItems: CongressGalleryItem[] = [
  {
    id: 'gallery-hero',
    alt: 'Auditório do congresso com plenária em andamento e público acompanhando o painel principal.',
    className: 'about-congress-gallery__item about-congress-gallery__item--hero',
    eyebrow: 'IIº CBDAS • São Paulo',
    src: idasanSampa,
    objectPosition: 'center 35%',
    showBadge: false,
    showOverlay: false,
  },
  {
    id: 'gallery-side',
    alt: 'Registro vertical de participantes do congresso no auditório durante a programação.',
    className: 'about-congress-gallery__item about-congress-gallery__item--side',
    eyebrow: 'IIº CBDAS • São Paulo',
    src: idasanVertical,
    objectPosition: 'center center',
    showBadge: false,
  },
  {
    id: 'gallery-mid-a',
    alt: 'Palco do congresso com painel e público acompanhando a programação.',
    className: 'about-congress-gallery__item about-congress-gallery__item--mid-a',
    eyebrow: 'Curadoria',
    src: idasanPalcoSampa,
    objectPosition: 'center 42%',
    showBadge: false,
    showOverlay: false,
  },
  {
    id: 'gallery-mid-b',
    alt: 'Participantes do congresso durante mesa e interação no auditório.',
    className: 'about-congress-gallery__item about-congress-gallery__item--mid-b',
    eyebrow: 'Ambiente',
    src: sampaIdasanGente,
    objectPosition: 'center 36%',
    showBadge: false,
    showOverlay: false,
  },
  {
    id: 'gallery-foot-a',
    alt: 'Participantes conversando durante o congresso em ambiente institucional.',
    className: 'about-congress-gallery__item about-congress-gallery__item--foot-a',
    eyebrow: 'Trajetória',
    src: amigasConversando,
    objectPosition: 'center 40%',
    showBadge: false,
    showOverlay: false,
  },
  {
    id: 'gallery-foot-b',
    alt: 'Plateia do congresso acompanhando palestra em auditório.',
    className: 'about-congress-gallery__item about-congress-gallery__item--foot-b',
    eyebrow: 'Brasília 2026',
    src: plateiaIdasan,
    objectPosition: 'center 42%',
    showBadge: false,
    showOverlay: false,
  },
];

const editorialParagraphs = eventData.about.text;

const eventDate = `${eventData.general.date} de 2026`;
const eventLocation = `${eventData.general.location}, Brasília - DF`;

const CongressGalleryImage = ({
  alt,
  className,
  index,
  eyebrow,
  title,
  src,
  objectPosition,
  showBadge = true,
  showOverlay = true,
}: CongressGalleryImageProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className={className}
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 22, scale: 0.975 }
      }
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      viewport={{ once: true, amount: 0.24 }}
      transition={{
        duration: prefersReducedMotion ? 0.42 : 0.72,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="group relative isolate h-full w-full overflow-hidden rounded-[24px] border border-white/72 bg-slate-200 shadow-[0_26px_60px_-42px_rgba(6,21,57,0.44)] transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_34px_72px_-44px_rgba(6,21,57,0.5)]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ objectPosition: objectPosition ?? 'center' }}
        />

        {showOverlay ? (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,21,57,0.08)_0%,rgba(6,21,57,0.16)_44%,rgba(6,21,57,0.78)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/18 via-white/6 to-transparent mix-blend-screen" />
          </>
        ) : null}

        {showBadge ? (
          <div className="absolute inset-x-4 top-4 sm:inset-x-5 sm:top-5">
            <span className="inline-flex rounded-full border border-white/18 bg-white/14 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-md sm:text-[0.68rem]">
              {eyebrow}
            </span>
          </div>
        ) : null}

        {showOverlay && title ? (
          <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
            <p className="max-w-[20rem] text-[0.95rem] font-semibold leading-[1.28] text-white sm:text-[1.02rem]">
              {title}
            </p>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
};

export const AboutCongress = () => {
  return (
    <section id="guia-cbdas" className="relative overflow-hidden bg-[#fbfaf6] py-24 md:py-28 xl:py-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 bg-[radial-gradient(circle,_rgba(249,214,0,0.12)_0%,_transparent_72%)]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 bg-[radial-gradient(circle,_rgba(28,39,81,0.08)_0%,_transparent_72%)]" />
      </div>

      <div className="relative mx-auto flex max-w-[1360px] flex-col gap-14 px-6 sm:px-8 md:grid md:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] md:items-stretch md:gap-12 lg:gap-16 xl:gap-20 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="order-2 md:order-1 md:flex"
        >
          <div className="relative flex-1 md:h-full">
            <div className="pointer-events-none absolute inset-x-[8%] inset-y-[5%] rounded-[38px] bg-[linear-gradient(145deg,rgba(255,255,255,0.54)_0%,rgba(249,250,246,0.18)_52%,rgba(249,214,0,0.12)_100%)]" />
            <div className="pointer-events-none absolute -left-2 top-6 h-28 w-28 rounded-full bg-[#f9d600]/18 blur-3xl sm:h-36 sm:w-36" />
            <div className="pointer-events-none absolute bottom-4 right-3 h-36 w-36 rounded-full bg-[#10224f]/10 blur-3xl sm:h-44 sm:w-44" />

            <div className="about-congress-gallery relative">
              {congressGalleryItems.map((item, index) => (
                <Fragment key={item.id}>
                  <CongressGalleryImage index={index} {...item} />
                </Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.82, ease: 'easeOut' }}
          className="order-1 md:order-2"
        >
          <div className="max-w-[46rem] md:ml-auto">
            <header className="space-y-4 sm:space-y-5">
              <span className="type-eyebrow inline-flex items-center gap-3 text-slate-500">
                <span className="h-px w-10 bg-slate-300" />
                Sobre o IIIº CBDAS
              </span>

              <h2 className="type-display-title text-[clamp(2.35rem,1.62rem+3.15vw,4.55rem)] leading-[0.96] tracking-[0.08em] text-idasan-navy-900 sm:leading-[0.94] lg:tracking-[0.1em]">
                IIIº CBDAS
              </h2>
            </header>

            <div className="mt-6 space-y-5 border-t border-slate-200/80 pt-6 text-slate-600 sm:mt-8 sm:pt-8">
              {editorialParagraphs.map((paragraph) => (
                <p key={paragraph} className="type-body">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 grid gap-6 border-t border-slate-200/80 pt-8 sm:grid-cols-2 sm:gap-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-slate-200 bg-white text-idasan-blue shadow-[0_16px_30px_-26px_rgba(6,21,57,0.55)]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="type-eyebrow !text-[0.68rem] text-slate-500">
                    Local
                  </p>
                  <p className="type-body-sm mt-2 text-slate-700">
                    {eventLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-slate-200 bg-white text-idasan-blue shadow-[0_16px_30px_-26px_rgba(6,21,57,0.55)]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="type-eyebrow !text-[0.68rem] text-slate-500">
                    Quando
                  </p>
                  <p className="type-body-sm mt-2 text-slate-700">
                    {eventDate}
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.85, ease: 'easeOut', delay: 0.12 }}
              className="relative mt-8 sm:mt-10"
            >
              <div className="relative flex min-h-[124px] items-center justify-center sm:min-h-[152px] lg:min-h-[184px]">
                <img
                  src={elementosBrasilia}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  width={1040}
                  height={240}
                  className="w-[112%] max-w-[38rem] scale-[1.2] object-contain opacity-[0.34] mix-blend-multiply sm:w-[108%] sm:max-w-[42rem] lg:w-[118%] lg:max-w-[48rem] lg:translate-x-5"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
