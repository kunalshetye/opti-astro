/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: { extend: {} },
    plugins: [
        require('daisyui'),
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
    daisyui: {
        themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
        darkTheme: 'light', // name of one of the included themes for dark mode
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
        themeRoot: ':root', // The element that receives theme color CSS variables
    },
};
