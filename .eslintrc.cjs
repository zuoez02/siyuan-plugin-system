module.exports = {
    env: {
        browser: true,
        node: true,
    },
    extends: ['eslint-config-prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['**/*.svelte'],
            processor: 'svelte3/svelte3',
        },
    ],
    plugins: ['@typescript-eslint', 'svelte3'],
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: [2, 'single' ],
        semi: ['error', 'always'],
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
    },
    settings: {
        'svelte3/typescript': true,
    },
};
