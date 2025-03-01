/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4a7729', // Our main green color
          dark: '#3d6222',    // Darker shade for hover states
        },
        secondary: {
          DEFAULT: '#2c2c2c', // Dark gray/almost black
          light: '#f6f6f6',   // Light gray for backgrounds
        },
        accent: '#e6a532',    // Accent color for highlights
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 