declare global {
  interface Window {
    gtag: (command: string, action: string, params: any) => void;
  }
}

export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

export const initScrollDepthTracking = () => {
  if (typeof window === 'undefined') return;

  let scrollDepths = new Set<number>();
  const depths = [25, 50, 75, 100];

  const calculateScrollDepth = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    
    depths.forEach(depth => {
      if (scrollPercentage >= depth && !scrollDepths.has(depth)) {
        scrollDepths.add(depth);
        trackEvent(
          'scroll_depth',
          'engagement',
          `Scrolled ${depth}%`,
          depth
        );
      }
    });
  };

  let throttleTimer: NodeJS.Timeout;
  const throttle = (callback: Function, time: number) => {
    if (throttleTimer) return;
    
    throttleTimer = setTimeout(() => {
      callback();
      throttleTimer = undefined as any;
    }, time);
  };

  window.addEventListener('scroll', () => {
    throttle(calculateScrollDepth, 500);
  });
};

export const trackCarouselInteraction = (action: 'next' | 'prev' | 'dot', index: number) => {
  trackEvent(
    'carousel_interaction',
    'engagement',
    `Carousel ${action} - Image ${index + 1}`
  );
};

export const trackCTAClick = (ctaType: string) => {
  trackEvent(
    'cta_click',
    'conversion',
    ctaType
  );
}; 