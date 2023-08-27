/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#9102E4',
        primaryShade: '#6f2dbd',
        primaryTint: '#9DACFF',
        secondary: '#6C757D',
        tertiary1: '#B551EB',
        tertiary2: '#02B3E4',
        neutralLight: '#474b57',
        neutralMedium: '#2f343e',
        neutralDark: '#222222',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
