import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
          light: 'var(--secondary-light)',
          50: 'var(--secondary-50)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
        },
        backdrop: {
          primary: 'var(--backdrop-primary)',
          secondary: 'var(--backdrop-secondary)',
        },
        gold: 'var(--secondary)',
        charcoal: 'var(--primary)',
        sage: 'var(--accent)',
      },
      fontFamily: {
        serif: ['var(--font-heading)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
        chinese: ['var(--font-chinese)', 'Noto Serif SC', 'Songti SC', 'serif'],
      },
      fontSize: {
        display: 'var(--text-display)',
        heading: 'var(--text-heading)',
        subheading: 'var(--text-subheading)',
        body: 'var(--text-body)',
        small: 'var(--text-small)',
      },
      maxWidth: {
        reading: '72ch',
      },
      transitionTimingFunction: {
        elegant: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
