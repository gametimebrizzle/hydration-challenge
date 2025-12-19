import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c5d6c5',
          300: '#9db89d',
          400: '#769876',
          500: '#557c55', // Base sage
          600: '#426142',
          700: '#364d36',
          800: '#2d3e2d',
          900: '#263326',
        },
        furman: {
          50: '#f2f0f9',
          100: '#e6e1f2',
          200: '#d0c3e6',
          300: '#b49dd5',
          400: '#9673c2',
          500: '#582c83', // Furman Purple (approximate)
          600: '#6845a0',
          700: '#583687',
          800: '#4b2f70',
          900: '#3e285a',
        },
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
