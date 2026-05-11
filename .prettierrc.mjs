/** @type {import("prettier").Config} */
export default {
    plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
    tailwindStylesheet: './src/styles/global.css',
    trailingComma: 'es5',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
};
