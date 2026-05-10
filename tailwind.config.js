
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: '#f9fafb',   // light grey
        surface: '#ffffff',      // white cards

        // Text
        primaryText: '#111827',  // dark text
        secondaryText: '#4b5563',

        // Borders
        borderLight: '#e5e7eb',

        // Accent Colors
        primary: '#2563eb',   // blue
        success: '#16a34a',   // green
        warning: '#f59e0b',   // yellow
        danger: '#ef4444',    // red
        accent: '#f97316',    // orange
      },
    },
  },
  plugins: [],
};