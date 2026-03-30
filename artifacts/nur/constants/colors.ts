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
    teal: '#3d8c7c',
    tealLight: '#5ab5a2',
    tealDim: 'rgba(61,140,124,0.15)',
    text: '#ede8df',
    text2: '#9c9488',
    text3: '#5c5750',
    amber: '#d4870a',
    amberDim: 'rgba(212,135,10,0.15)',
    error: '#8b3a4a',
    white06: 'rgba(255,255,255,0.06)',
    white10: 'rgba(255,255,255,0.10)',
  },
  gradients: {
    nextPrayer: ['#1a1608', '#201c10', '#181612'] as const,
    quranHero: ['#160e06', '#1c1508', '#141210'] as const,
    zakatHeader: ['#0e1612', '#121a15', '#141210'] as const,
    dhikrCard: ['#0e0f16', '#131420', '#141210'] as const,
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
