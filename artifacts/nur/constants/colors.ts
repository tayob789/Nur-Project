export const theme = {
  colors: {
    bg: '#0c0b09',
    surface: '#141210',
    surface2: '#1c1914',
    surface3: '#221f1a',
    border: 'rgba(255,255,255,0.07)',
    border2: 'rgba(255,255,255,0.12)',
    gold: '#c9a84c',
    goldLight: '#e8c97a',
    goldDim: 'rgba(201,168,76,0.15)',
    /** Deeper gold for Arabic headings / accents */
    goldAccent: '#D4A017',
    /** Verse card & warm surfaces */
    verseCardBg: '#1a1608',
    teal: '#3d8c7c',
    tealLight: '#5ab5a2',
    /** Compass north marker (distinct from labels) */
    compassNorth: '#44aa99',
    tealDim: 'rgba(61,140,124,0.15)',
    text: '#ede8df',
    /** Dark ink on light surfaces (e.g. error screen light mode) */
    textInk: '#000000',
    text2: '#9c9488',
    text3: '#5c5750',
    amber: '#d4870a',
    amberDim: 'rgba(212,135,10,0.15)',
    error: '#8b3a4a',
    /** Softer rose for inline error text */
    errorSoft: '#c08090',
    white06: 'rgba(255,255,255,0.06)',
    white10: 'rgba(255,255,255,0.10)',
    white70: 'rgba(255,255,255,0.7)',
    black70: 'rgba(0,0,0,0.7)',
    /** Full-screen overlays */
    overlayScrim: 'rgba(12,11,9,0.88)',
    tabBarFill: 'rgba(20,18,16,0.97)',
    modalOverlay: 'rgba(0,0,0,0.5)',
    modalOverlay70: 'rgba(0,0,0,0.7)',
    shadow: '#000000',
    /** Links (iOS-style + in-app) */
    link: '#007AFF',
    linkMuted: '#2e78b7',
    /** Error boundary (light system surfaces) */
    errorFallbackLightBg: '#FFFFFF',
    errorFallbackLightSecondary: '#F2F2F7',
    errorFallbackDarkBg: '#000000',
    errorFallbackDarkSecondary: '#1C1C1E',
    errorFallbackButtonLabel: '#FFFFFF',
    hairlineOnDark: 'rgba(255,255,255,0.1)',
    hairlineOnLight: 'rgba(0,0,0,0.1)',
    /** Gold border alphas */
    goldBorder06: 'rgba(201,168,76,0.06)',
    goldBorder20: 'rgba(201,168,76,0.2)',
    goldBorder25: 'rgba(201,168,76,0.25)',
    goldBorder30: 'rgba(201,168,76,0.3)',
    goldBorder40: 'rgba(201,168,76,0.4)',
    goldBorder50: 'rgba(201,168,76,0.5)',
    goldBorder80: 'rgba(201,168,76,0.8)',
    /** Teal border alphas */
    tealBorder25: 'rgba(61,140,124,0.25)',
    tealBorder30: 'rgba(61,140,124,0.3)',
    tealBorder40: 'rgba(61,140,124,0.4)',
    /** Amber border / fill */
    amberBorder30: 'rgba(212,135,10,0.3)',
    amberBg10: 'rgba(212,135,10,0.1)',
    /** Error surfaces */
    errorBg15: 'rgba(139,58,74,0.15)',
    errorBorder30: 'rgba(139,58,74,0.3)',
  },
  gradients: {
    nextPrayer: ['#1a1608', '#201c10', '#181612'] as const,
    quranHero: ['#160e06', '#1c1508', '#141210'] as const,
    zakatHeader: ['#0e1612', '#121a15', '#141210'] as const,
    dhikrCard: ['#0e0f16', '#131420', '#141210'] as const,
    /** Seasonal occasion banner (Ramadan / Eid / Muharram) */
    seasonalBanner: ['#1a0e05', '#1c1108', '#141008'] as const,
  },
  shadows: {
    goldGlow: {
      shadowColor: '#c9a84c',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 6,
    },
    tealGlow: {
      shadowColor: '#3d8c7c',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
  },
};

export default theme;
