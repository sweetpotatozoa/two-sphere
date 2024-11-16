/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                black: '#2b2b2b',
            },
        },
        scrollbar: {
            hide: {
                'scrollbar-width': 'none', // Firefox
                '-ms-overflow-style': 'none', // IE 10+
                '&::-webkit-scrollbar': {
                    display: 'none', // Safari and Chrome
                },
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.scrollbar-hide': {
                    'scrollbar-width': 'none', // Firefox
                    '-ms-overflow-style': 'none', // IE 10+
                    '&::-webkit-scrollbar': {
                        display: 'none', // Safari and Chrome
                    },
                },
                '.kakaobutton-right': {
                    right: 'clamp(8px, 5vw, 16px)', // 5vw 기준으로 반응형 줄어듦
                },
            });
        },
    ],
};
