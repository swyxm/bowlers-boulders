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
        // Background Colors
        'bg-base': '#0b0a10',      // Main dark background
        'bg-dark': '#1a0f2e',      // Dark purple for mountains/shadows
        'bg-medium': '#2b2146',    // Medium purple for depth
        'bg-light': '#3d2f5a',     // Light purple for highlights
        
        // Primary Colors (Purple Theme)
        'primary': '#5b3fb6',      // Main purple
        'primary-light': '#e8e1f3', // Light text
        'primary-dark': '#493391',  // Darker purple for hover states
        
        // Secondary Colors
        'secondary': '#6b4c8a',    // Secondary purple
        'secondary-light': '#c8b9ea', // Light purple text
        'secondary-dark': '#4a3c6b', // Dark purple
        
        // Accent Colors
        'accent': '#a998d8',       // Accent purple for subtitles
        'accent-light': '#b8a8e8', // Lighter accent
        
        // Character Colors
        'runner': '#22c55e',       // Green for Runner
        'rogue': '#8b5cf6',        // Purple for Rogue  
        'tank': '#f59e0b',         // Orange for Tank
        
        // Character Background Colors
        'bg-runner': '#22c55e',    // Green background for Runner
        'bg-rogue': '#8b5cf6',     // Purple background for Rogue
        'bg-tank': '#f59e0b',      // Orange background for Tank
        
        // UI Colors
        'border': '#3d2f5a',       // Border color
        'border-light': '#6b4c8a', // Light border
        'shadow': '#1a0f2e',       // Shadow color
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
      },
    },
  },
  plugins: [],
};

export default config;
