import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#2d1b69',
        'bg-dark': '#3d2f7a',
        'bg-medium': '#4a3c8b',
        'bg-light': '#5a4c9b',
        
 
        'primary': '#e8e1f3',
        'primary-light': '#ffffff',
        'primary-dark': '#c8b9ea',
        
        'secondary': '#c8b9ea',
        'secondary-light': '#ffffff',
        'secondary-dark': '#a998d8',
        
        'accent': '#a998d8',      
        'accent-light': '#c8b9ea',
        'accent-dark': '#8b7cb8', 

        
        'border': '#4a3c8b',      
        'border-light': '#6b4c9b',
        'shadow': '#1a0f2e',      
        'text-primary': '#e8e1f3',
        'text-secondary': '#c8b9ea',
        'panel-bg': '#f3f4f6',  
        'speckle': '#8b5cf6',   
      },
      fontFamily: {
        'daydream': ['Daydream', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        'bowler-subtext': ['BowlerSubtext', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.8s ease-out',
        'scale-in': 'scale-in 0.6s ease-out',
        'wiggle': 'wiggle 2s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 8s linear infinite',
        'svg-glow': 'svg-glow 2s ease-in-out infinite',
        'svg-glow-color': 'svg-glow-color 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 20px #5b3fb6, 0 0 40px #5b3fb6, 0 0 60px #5b3fb6' },
          '50%': { textShadow: '0 0 30px #6b4c8a, 0 0 50px #6b4c8a, 0 0 70px #6b4c8a' },
        },
        'svg-glow': {
          '0%, 100%': {
            filter: 'drop-shadow(4px 4px 0px #000) drop-shadow(0 0 20px #5b3fb6) drop-shadow(0 0 40px #5b3fb6) drop-shadow(0 0 60px #5b3fb6)'
          },
          '50%': {
            filter: 'drop-shadow(4px 4px 0px #000) drop-shadow(0 0 30px #6b4c8a) drop-shadow(0 0 50px #6b4c8a) drop-shadow(0 0 70px #6b4c8a)'
          }
        },
        'svg-glow-color': {
          '0%, 100%': { backgroundColor: '#5b3fb6', transform: 'scale(1)' },
          '50%': { backgroundColor: '#6b4c8a', transform: 'scale(1.02)' }
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px #5b3fb6, 0 0 30px #e8e1f3',
            borderColor: '#e8e1f3'
          },
          '50%': { 
            boxShadow: '0 0 40px #6b4c8a, 0 0 60px #5b3fb6, 0 0 80px #e8e1f3',
            borderColor: '#5b3fb6'
          },
        },
        'slide-in': {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.05)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
