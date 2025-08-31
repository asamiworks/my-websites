import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'greige': {
          50: '#FAFAF9',
          100: '#F5F5F3',
          200: '#E8E6E1',
          300: '#D4D0C9',
          400: '#B8B2A7',
          500: '#9B9284',
          600: '#7E7668',
          700: '#645D52',
          800: '#4A453D',
          900: '#312E29',
        },
        'cream': '#FBF8F3',
        'charcoal': '#2C2C2C',
        'primary': '#9B9284',
        'secondary': '#D4D0C9',
      },
      fontFamily: {
        'japanese': ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
