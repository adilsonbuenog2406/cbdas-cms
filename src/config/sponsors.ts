export type SponsorLogoItem = {
  name: string;
  alt: string;
  logoSrc?: string;
};

// Adicione os PNGs reais aqui quando os assets estiverem disponíveis.
// Exemplo:
// import atlasRegulacaoLogo from '../assets/sponsors/diamante/atlas-regulacao.png';
// e depois substitua `logoSrc: undefined` por `logoSrc: atlasRegulacaoLogo`.

export const diamondSponsors = [
  {
    name: 'Atlas Regulação',
    alt: 'Logo da Atlas Regulação',
    logoSrc: undefined,
  },
  {
    name: 'Nexo Público',
    alt: 'Logo da Nexo Público',
    logoSrc: undefined,
  },
] satisfies readonly SponsorLogoItem[];

export const goldSponsors = [
  {
    name: 'Orbe Jurídico',
    alt: 'Logo da Orbe Jurídico',
    logoSrc: undefined,
  },
  {
    name: 'Veritas Governança',
    alt: 'Logo da Veritas Governança',
    logoSrc: undefined,
  },
  {
    name: 'Pacto Compliance',
    alt: 'Logo da Pacto Compliance',
    logoSrc: undefined,
  },
  {
    name: 'Câmara Técnica',
    alt: 'Logo da Câmara Técnica',
    logoSrc: undefined,
  },
] satisfies readonly SponsorLogoItem[];

export const silverSponsors = [
  {
    name: 'Axioma Consultoria',
    alt: 'Logo da Axioma Consultoria',
    logoSrc: undefined,
  },
  {
    name: 'Fórum Administrativo',
    alt: 'Logo do Fórum Administrativo',
    logoSrc: undefined,
  },
  {
    name: 'Norte Integridade',
    alt: 'Logo da Norte Integridade',
    logoSrc: undefined,
  },
  {
    name: 'Cívica Soluções',
    alt: 'Logo da Cívica Soluções',
    logoSrc: undefined,
  },
  {
    name: 'Mesa Regulatória',
    alt: 'Logo da Mesa Regulatória',
    logoSrc: undefined,
  },
  {
    name: 'Plural Advocacia',
    alt: 'Logo da Plural Advocacia',
    logoSrc: undefined,
  },
] satisfies readonly SponsorLogoItem[];

export const supporters = [
  {
    name: 'Instituto Convergência',
    alt: 'Logo do Instituto Convergência',
    logoSrc: undefined,
  },
  {
    name: 'Rede Pública',
    alt: 'Logo da Rede Pública',
    logoSrc: undefined,
  },
  {
    name: 'Pilar Estratégico',
    alt: 'Logo da Pilar Estratégico',
    logoSrc: undefined,
  },
  {
    name: 'Agenda Técnica',
    alt: 'Logo da Agenda Técnica',
    logoSrc: undefined,
  },
  {
    name: 'Eixo Acadêmico',
    alt: 'Logo da Eixo Acadêmico',
    logoSrc: undefined,
  },
  {
    name: 'Ponte Institucional',
    alt: 'Logo da Ponte Institucional',
    logoSrc: undefined,
  },
  {
    name: 'Núcleo DAS',
    alt: 'Logo do Núcleo DAS',
    logoSrc: undefined,
  },
  {
    name: 'Câmara de Estudos',
    alt: 'Logo da Câmara de Estudos',
    logoSrc: undefined,
  },
] satisfies readonly SponsorLogoItem[];
