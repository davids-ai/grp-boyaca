/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-app': '#F7F8FA',
        'bg-card': '#FFFFFF',
        'bg-sidebar': '#FFFFFF',
        'navy': '#1C1C3A',
        'accent': '#C49A22',
        'accent-soft': '#FFF8E7',
        'blue': '#4F6EF7',
        'blue-soft': '#EEF1FE',
        'green': '#12B76A',
        'green-soft': '#ECFDF5',
        'red': '#F04438',
        'red-soft': '#FEF3F2',
        'border': '#EAECF0',
        'text': '#101828',
        'text-2': '#344054',
        'text-3': '#667085',
      },
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(16,24,40,0.05)',
        'md': '0 4px 8px rgba(16,24,40,0.08), 0 1px 2px rgba(16,24,40,0.04)',
        'lg': '0 12px 24px rgba(16,24,40,0.10), 0 4px 8px rgba(16,24,40,0.06)',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'fadeIn': 'fadeIn 0.6s ease-out',
        'slideUp': 'slideUp 0.25s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}



