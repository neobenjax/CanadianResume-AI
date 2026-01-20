import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: '#7C3AED', // violet-600
                    foreground: '#ffffff',
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed', // Main Brand Color
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
                accent: {
                    DEFAULT: '#2dd4bf', // teal-400
                    foreground: '#0f172a',
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                },
                sidebar: {
                    DEFAULT: '#1e1b4b', // deeply dark violet/slate
                    foreground: '#ffffff',
                }
            },
            fontFamily: {
                sans: ['var(--font-jakarta)', 'var(--font-inter)', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glow-primary': '0 0 20px rgba(124, 58, 237, 0.3)',
                'glow-accent': '0 0 20px rgba(45, 212, 191, 0.3)',
            },
            backgroundImage: {
                'mesh-gradient': 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
                'subtle-mesh': 'radial-gradient(at 40% 20%, rgba(124, 58, 237, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(45, 212, 191, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(124, 58, 237, 0.1) 0px, transparent 50%)',
            }
        },
    },
    plugins: [],
};
export default config;
