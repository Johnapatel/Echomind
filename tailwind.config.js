import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
      colors: {
        bg:       '#F7F3EE',
        surface:  '#EFE7DE',
        surface2: '#E8DDD3',
        text:     '#2E2A27',
        muted:    '#7A6F68',
        dim:      '#B5A89E',
        accent:   '#6E8FA3',
        sage:     '#A8B8A0',
        terra:    '#C98B73',
      },
    },
  },
  plugins: [],
}
export default config
