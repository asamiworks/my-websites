/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // i-manabeeブランドカラー
        'honey-yellow': '#FFB300',
        'heart-pink': '#FF6B6B',
        'safe-green': '#4CAF50',
        'bg-cream': '#FFF8E1',

        // プランカラー
        'free-gray': '#9E9E9E',
        'kids-blue': '#2196F3',
        'friends-purple': '#9C27B0',
        'premium-gold': '#FFB300',

        // システムカラー
        'error-red': '#FF5252',
        'warning-yellow': '#FFC107',
        'info-blue': '#2196F3',
        'text-main': '#212121',
        'text-sub': '#757575',
      },
      fontFamily: {
        sans: ['Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', 'Meiryo', 'メイリオ', 'sans-serif'],
      },
      animation: {
        'bee-flying': 'bee-flying 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'bee-flying': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, -5px) rotate(5deg)' },
          '50%': { transform: 'translate(-10px, 5px) rotate(-5deg)' },
          '75%': { transform: 'translate(5px, -10px) rotate(3deg)' },
        },
      },
      boxShadow: {
        'manabee-sm': '0 1px 3px rgba(0,0,0,0.12)',
        'manabee-md': '0 4px 6px rgba(0,0,0,0.16)',
        'manabee-lg': '0 10px 20px rgba(0,0,0,0.19)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}