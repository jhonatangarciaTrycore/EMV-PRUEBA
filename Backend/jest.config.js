export default {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'services/**/*.js',
        'controllers/**/*.js',
        'helpers/**/*.js',
        '!**/node_modules/**',
    ],
    coverageDirectory: 'coverage',
    testMatch: ['**/tests/**/*.test.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};
