module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    globals: {
        window: 'readonly'
    },
    rules: {
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    },
    ignorePatterns: ['node_modules/']
};
