import { useEffect, useRef, useState } from 'react';

type UseInScrollContainerOptions = {
  root: HTMLElement | null;
  threshold?: number;
  rootMargin?: string;
};

const revealWithoutObserverMediaQuery =
  '(max-width: 767px), (hover: none) and (pointer: coarse), (prefers-reduced-motion: reduce)';

const shouldRevealWithoutObserver = () => {
  if (typeof window === 'undefined' || !('matchMedia' in window)) {
    return false;
  }

  return window.matchMedia(revealWithoutObserverMediaQuery).matches;
};

export const useInScrollContainer = <T extends HTMLElement>({
  root,
  threshold = 0.18,
  rootMargin = '0px 0px -12% 0px',
}: UseInScrollContainerOptions) => {
  const targetRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(() => shouldRevealWithoutObserver());
  const [skipObserver, setSkipObserver] = useState(() => shouldRevealWithoutObserver());

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return;
    }

    const mediaQuery = window.matchMedia(revealWithoutObserverMediaQuery);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setSkipObserver(event.matches);

      if (event.matches) {
        setIsVisible(true);
      }
    };

    handleChange(mediaQuery);

    const addListener = mediaQuery.addEventListener?.bind(mediaQuery);
    const removeListener = mediaQuery.removeEventListener?.bind(mediaQuery);

    if (addListener && removeListener) {
      addListener('change', handleChange);
      return () => removeListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const node = targetRef.current;

    if (!node || isVisible) {
      return;
    }

    if (skipObserver) {
      setIsVisible(true);
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        root: root ?? null,
        rootMargin,
        threshold,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, root, rootMargin, skipObserver, threshold]);

  return { targetRef, isVisible };
};
