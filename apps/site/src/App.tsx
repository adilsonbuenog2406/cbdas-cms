import React, { useEffect } from 'react';
import { sectionVisibility } from './config/sectionVisibility';
import { scrollToSection } from './utils/scrollToSection';
import { DeferredSection } from './components/shared/DeferredSection';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { CongressActionsBand } from './components/sections/CongressActionsBand';

const AboutCongress = () =>
  import('./components/sections/AboutCongress').then((m) => ({ default: m.AboutCongress }));
const Institution = () =>
  import('./components/sections/Institution').then((m) => ({ default: m.Institution }));
const PastEditions = () =>
  import('./components/sections/PastEditions').then((m) => ({ default: m.PastEditions }));
const Schedule = () =>
  import('./components/sections/Schedule').then((m) => ({ default: m.Schedule }));
const Workshops = () =>
  import('./components/sections/Workshops').then((m) => ({ default: m.Workshops }));
const Registration = () =>
  import('./components/sections/Registration').then((m) => ({ default: m.Registration }));
const CommitmentInstructions = () =>
  import('./components/sections/CommitmentInstructions').then((m) => ({
    default: m.CommitmentInstructions,
  }));
const Speakers = () =>
  import('./components/sections/Speakers').then((m) => ({ default: m.Speakers }));
const ArticleSubmissionAccess = () =>
  import('./components/sections/ArticleSubmissionAccess').then((m) => ({
    default: m.ArticleSubmissionAccess,
  }));
const RegistrationDiscounts = () =>
  import('./components/sections/RegistrationDiscounts').then((m) => ({
    default: m.RegistrationDiscounts,
  }));
const Sponsors = () =>
  import('./components/sections/Sponsors').then((m) => ({ default: m.Sponsors }));
const Location = () =>
  import('./components/sections/Location').then((m) => ({ default: m.Location }));
const Testimonials = () =>
  import('./components/sections/Testimonials').then((m) => ({ default: m.Testimonials }));
const Contact = () =>
  import('./components/sections/Contact').then((m) => ({ default: m.Contact }));

export default function App() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollToSection(hash);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-idasan-yellow selection:text-idasan-blue">
      <Header />

      <main>
        {sectionVisibility.sections.hero && <Hero />}
        {sectionVisibility.sections.hero && <CongressActionsBand />}
        {sectionVisibility.sections.about && <DeferredSection load={AboutCongress} />}
        {sectionVisibility.sections.institution && <DeferredSection load={Institution} />}
        {sectionVisibility.sections.schedule && <DeferredSection load={Schedule} />}
        {sectionVisibility.sections.workshops && <DeferredSection load={Workshops} />}
        {sectionVisibility.sections.registration && <DeferredSection load={Registration} />}
        {sectionVisibility.sections.commitment && <DeferredSection load={CommitmentInstructions} />}
        {sectionVisibility.sections.scientificArticles && (
          <DeferredSection load={ArticleSubmissionAccess} />
        )}
        {sectionVisibility.sections.registrationDiscounts && (
          <DeferredSection load={RegistrationDiscounts} />
        )}
        {sectionVisibility.sections.speakers && <DeferredSection load={Speakers} />}
        {sectionVisibility.sections.pastEditions && <DeferredSection load={PastEditions} />}
        {sectionVisibility.sections.location && <DeferredSection load={Location} />}
        {sectionVisibility.sections.sponsors && <DeferredSection load={Sponsors} />}
        {sectionVisibility.sections.testimonials && <DeferredSection load={Testimonials} />}
      </main>

      {sectionVisibility.sections.contact && <DeferredSection load={Contact} />}
    </div>
  );
}
