import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#f3f8ff',
          100: '#d9e9ff',
          200: '#b6d6ff',
          300: '#84baff',
          400: '#4b97ff',
          500: '#2877ff',
          600: '#1b5ce8',
          700: '#1849b7',
          800: '#193f8f',
          900: '#1b396f'
        },
        sand: '#f6f2eb'
      },
      boxShadow: {
        card: '0 16px 32px rgba(30, 58, 138, 0.10)'
      }
    }
  }
}
