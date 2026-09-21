import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ededed',
        arch: {
          dark: '#080808',
          card: '#111111',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#eccfa3',
          gold: '#d5cbb2',
          rose: '#9b0000',
          muted: '#8a8a8a',
        },
      },
      fontFamily: {
        // `font-syne` is used across the hero + gallery; without this entry the
        // class silently resolved to nothing.
        syne: ['Syne', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
