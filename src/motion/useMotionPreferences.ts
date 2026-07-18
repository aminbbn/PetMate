import { useState, useEffect } from 'react';
import { useAppStore } from '../store';

export function useMotionPreferences() {
  const preferences = useAppStore(state => state.preferences);
  const motionMode = preferences?.motion?.mode || 'full';
  const routeTransitionsEnabled = preferences?.motion?.routeTransitionsEnabled ?? true;
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReduced(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  const reducedMotion = 
    motionMode === 'reduced' || 
    (motionMode === 'system' && systemReduced);

  return { reducedMotion, routeTransitionsEnabled: routeTransitionsEnabled && !reducedMotion };
}
