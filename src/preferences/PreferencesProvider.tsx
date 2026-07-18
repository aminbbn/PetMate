import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppStore, AppPreferences, DEFAULT_PREFERENCES } from '../store';

interface PreferencesContextProps {
  reducedMotion: boolean;
  cursorGlowEnabled: boolean;
  edgeGlowEnabled: boolean;
  semanticIconAnimationsEnabled: boolean;
  routeTransitionsEnabled: boolean;
  textScale: 'normal' | 'large';
  strongFocusIndicators: boolean;
  digitStyle: 'persian' | 'latin';
  dateDisplayMode: 'jalali' | 'gregorian';
  timezone: string;
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const preferences = useAppStore(state => state.preferences || DEFAULT_PREFERENCES);
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

  const motionMode = preferences.motion?.mode || 'full';
  const reducedMotion = motionMode === 'reduced' || (motionMode === 'system' && systemReduced);
  const routeTransitionsEnabled = !!preferences.motion?.routeTransitionsEnabled && !reducedMotion;
  const cursorGlowEnabled = !!preferences.motion?.cursorGlowEnabled && !reducedMotion;
  const edgeGlowEnabled = !!preferences.motion?.edgeGlowEnabled && !reducedMotion;
  const semanticIconAnimationsEnabled = !!preferences.motion?.semanticIconAnimationsEnabled && !reducedMotion;

  const textScale = preferences.accessibility?.textScale || 'normal';
  const strongFocusIndicators = !!preferences.accessibility?.strongFocusIndicators;

  const digitStyle = preferences.display?.digitStyle || 'persian';
  const dateDisplayMode = preferences.display?.dateDisplayMode || 'jalali';
  
  // Resolve manual vs auto timezone
  const resolvedTimezone = preferences.display?.timeZoneMode === 'manual' && preferences.display?.manualTimeZone
    ? preferences.display.manualTimeZone
    : Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Run all side-effects when preferences change
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    // 1. Text Scale Side-effect
    if (textScale === 'large') {
      htmlEl.classList.add('text-scale-large');
    } else {
      htmlEl.classList.remove('text-scale-large');
    }

    // 2. Strong Focus Indicators Side-effect
    if (strongFocusIndicators) {
      bodyEl.classList.add('strong-focus-indicators-enabled');
    } else {
      bodyEl.classList.remove('strong-focus-indicators-enabled');
    }

    // 3. Semantic Icon Animations Side-effect
    if (semanticIconAnimationsEnabled) {
      bodyEl.classList.add('semantic-icon-animations-enabled');
    } else {
      bodyEl.classList.remove('semantic-icon-animations-enabled');
    }
  }, [textScale, strongFocusIndicators, semanticIconAnimationsEnabled]);

  return (
    <PreferencesContext.Provider
      value={{
        reducedMotion,
        cursorGlowEnabled,
        edgeGlowEnabled,
        semanticIconAnimationsEnabled,
        routeTransitionsEnabled,
        textScale,
        strongFocusIndicators,
        digitStyle,
        dateDisplayMode,
        timezone: resolvedTimezone,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
