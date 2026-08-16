/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
        },
        primary: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        accent: {
          cyan: '#06B6D4',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          teal: '#14B8A6',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
        'glow-blue': '0 0 25px rgba(14, 165, 233, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
