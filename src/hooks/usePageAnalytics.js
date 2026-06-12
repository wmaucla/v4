import { useEffect } from 'react';

const fireEvent = (name, params) => {
  if (window.gtag) {
    window.gtag('event', name, { page: window.location.pathname, ...params });
  }
};

// GA4 engagement tracking for a long-scrolling page:
// scroll depth milestones, first view of each section, and time on page.
const usePageAnalytics = sectionIds => {
  // Scroll depth milestones (25 / 50 / 75 / 100%)
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const fired = new Set();

    const handleScrollDepth = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        return;
      }
      const pct = Math.round((window.scrollY / scrollable) * 100);
      milestones.forEach(m => {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          fireEvent('scroll_depth', { depth_percent: m });
        }
      });
    };

    window.addEventListener('scroll', handleScrollDepth, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollDepth);
  }, []);

  // Section visibility — fires once per section per visit
  useEffect(() => {
    const observers = sectionIds.map(id => {
      const el = document.getElementById(id);
      if (!el) {
        return null;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            fireEvent('section_viewed', { section: id });
            observer.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach(o => o && o.disconnect());
  }, []);

  // Time on page before leaving
  useEffect(() => {
    const startTime = Date.now();
    const handleUnload = () => {
      fireEvent('time_on_page', { seconds: Math.round((Date.now() - startTime) / 1000) });
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);
};

export default usePageAnalytics;
