/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        dark: {
          card: 'rgba(17, 24, 39, 0.7)',
          border: 'rgba(75, 85, 99, 0.3)',
          hover: 'rgba(31, 41, 55, 0.7)'
        }
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out"
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
        'dark-grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      boxShadow: {
        'premium': '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 6px 20px 0 rgba(0, 0, 0, 0.15)',
        'premium-dark': '0 4px 14px 0 rgba(0, 0, 0, 0.3)',
        'premium-dark-hover': '0 6px 20px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
