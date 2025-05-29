/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,opti-style.json}'],
    theme: { extend: {} },
    plugins: [
        function ({ addBase }) {
            addBase({
                h1: {
                    fontSize: '2.25rem', // text-3xl
                },
                h2: {
                    fontSize: '1.875rem', // text-2xl
                },
                h3: {
                    fontSize: '1.5rem', // text-xl
                },
                h4: {
                    fontSize: '1.25rem', // text-lg
                },
                h5: {
                    fontSize: '1.125rem', // text-base
                },
                h6: {
                    fontSize: '1rem', // text-sm
                },
            });
        },
    ],
};
