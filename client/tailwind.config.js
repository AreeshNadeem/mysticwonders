/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy:        '#6B1A2E',
        'burgundy-deep': '#3D0A16',
        'burgundy-mid':  '#891E38',
        'blush-bg':      '#FDEEF2',
        'blush-light':   '#F7D6DC',
        'blush-mid':     '#F0B8C4',
        'blush-border':  '#E8C4CC',
        'border-muted':  '#D4919F',
        'text-muted':    '#9B6070',
        'text-accent':   '#8B3545',
        cream:           '#FDF0F3',
        'dark-hero':     '#1E0A10',
        'dark-deep':     '#120408',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        garamond: ['"EB Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}
