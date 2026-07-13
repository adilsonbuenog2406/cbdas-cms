import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';

type DeferredSectionProps = {
  load: () => Promise<{ default: ComponentType }>;
};

declare global {
  interface Window {
    __CBDAS_EDITOR_CANVAS__?: boolean;
  }
}

function SectionFallback() {
  return <div className="min-h-px" aria-hidden="true" />;
}

function isEditorCanvas() {
  return typeof window !== 'undefined' && window.__CBDAS_EDITOR_CANVAS__ === true;
}

export function DeferredSection({ load }: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(isEditorCanvas);
  const LazyComponent = useMemo<LazyExoticComponent<ComponentType>>(() => lazy(load), [load]);

  useEffect(() => {
    if (isEditorCanvas()) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={<SectionFallback />}>
          <LazyComponent />
        </Suspense>
      ) : (
        <SectionFallback />
      )}
    </div>
  );
}
