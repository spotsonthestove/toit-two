import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Forestry palette
        'shadow-moss': '#2C3830',
        'speed-of-light': '#F6F4EF',
        'mariana-black': '#1B1E1E',
        'walnut-shell': '#AA8344',
        'good-as-gold': '#D3BA75',
        'green-tone-ink': '#47553C',
        'neugray': {
          50: '#f9fafb',
          100: '#f0f0f3',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      backdropBlur: {
        xs: '2px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        // Enhanced neumorphic shadows
        'neumorph': 'var(--shadow-light)',
        'neumorph-sm': 'var(--shadow-medium)',
        'neumorph-pressed': 'var(--shadow-inner)',
        'glass': 'var(--glass-shadow)',
        'inner': 'var(--shadow-inner)',
        // Additional interactive shadows
        'neumorph-hover': '8px 8px 20px rgba(0, 0, 0, 0.07), -8px -8px 20px rgba(255, 255, 255, 0.95)',
        'neumorph-active': 'inset 3px 3px 7px rgba(0, 0, 0, 0.07), inset -3px -3px 7px rgba(255, 255, 255, 0.7)',
      },
      backgroundImage: {
        'gradient-forestry': 'linear-gradient(to right bottom, #2C3830, #47553C)',
        'gradient-completed': 'linear-gradient(to right bottom, #47553C, #2C3830)',
        'gradient-pending': 'linear-gradient(to right bottom, #D3BA75, #AA8344)',
        'gradient-progress': 'linear-gradient(to right bottom, #AA8344, #D3BA75)',
      }
    },
  },
  plugins: [],
}

