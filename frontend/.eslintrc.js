module.exports = {
    extends: ['react-app', 'react-app/jest'],
    rules: {
      // Allow console.error and console.warn, but warn about console.log
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'warn',
    },
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    }
  };