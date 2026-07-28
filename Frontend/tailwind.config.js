/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B5FEF',
          hover: '#4A4EE3',
          light: 'rgba(91, 95, 239, 0.12)',
        },
        accent: {
          DEFAULT: '#7C5CFC',
          light: '#F3EFFF',
        },
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        'card-border': '#E9EDF5',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        status: {
          success: '#22C55E',
          danger: '#EF4444',
          warning: '#F59E0B',
        }
      },
      borderRadius: {
        'card': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(17, 24, 39, 0.04), 0 4px 16px -4px rgba(17, 24, 39, 0.06)',
        'card-hover': '0 8px 24px -4px rgba(91, 95, 239, 0.12), 0 4px 12px -2px rgba(17, 24, 39, 0.04)',
      }
    },
  },
  plugins: [],
}
