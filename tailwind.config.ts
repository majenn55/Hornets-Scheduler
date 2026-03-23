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
        // Greenhill School Hunter Green
        primary: {
          50: '#f0f7f1',
          100: '#d9ead9',
          200: '#b3d5b3',
          300: '#7ab87a',
          400: '#4a9a4a',
          500: '#2d7a2d',
          600: '#1a5e1a',
          700: '#155215',
          800: '#0f3f0f',
          900: '#0a2d0a',
        },
        // Greenhill School Vegas Gold
        accent: {
          50: '#fdf9ed',
          100: '#f9f0cf',
          200: '#f3e09f',
          300: '#eccb65',
          400: '#e4b53a',
          500: '#C5972C',
          600: '#a67a1e',
          700: '#875e18',
          800: '#6e4b15',
          900: '#5a3d12',
        },
      },
    },
  },
  plugins: [],
};
export default config;
