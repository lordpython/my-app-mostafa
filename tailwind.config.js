/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern color palette inspired by modern web trends
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff', 
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        neutral: {
          850: '#1f2937',
          950: '#030712',
        },
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
      },
      height: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      screens: {
        '3xl': '1920px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-diagonal': 'linear-gradient(45deg, var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/hero-pattern.svg')",
        'dots-pattern': "url('/images/dots.svg')",
        'mesh-pattern': "linear-gradient(40deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('/images/mesh.png')",
      },
      animation: {
        'text-slide': 'text-slide 12s linear infinite',
        'bounce-slow': 'bounce 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 1s linear infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.primary.400), 0 0 20px theme(colors.primary.600)',
        'neon-strong': '0 0 5px theme(colors.primary.400), 0 0 20px theme(colors.primary.600), 0 0 60px theme(colors.primary.800)',
        'inner-glow': 'inset 0 0 20px theme(colors.primary.500)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities, addBase }) {
      addUtilities({
        '.glass-morphism': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          '@media (forced-colors: active)': {
            'forced-color-adjust': 'none',
            '-ms-high-contrast-adjust': 'none',
          }
        },
        '.text-gradient': {
          'background-image': 'linear-gradient(to right, #6366f1, #d946ef)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          'color': 'transparent',
        },
        '.animate-gradient-x': {
          'background-size': '200% 200%',
          'animation': 'gradient 15s ease infinite',
          'transform': 'translateZ(0)',
        },
      })
    },
  ],
}
