/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#1a1a2e',
          dark: '#16162a',
        },
        priority: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          low: '#22c55e',
        },
        status: {
          pending: '#6b7280',
          processing: '#3b82f6',
          review: '#8b5cf6',
          completed: '#22c55e',
          escalated: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}
