module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    transform: { '\\.[jt]s?$': ['ts-jest', { tsconfig: { allowJs: true } }] },
    moduleNameMapper: {'^(\\.{1,2}/.*)\\.[jt]s$': '$1'},
    extensionsToTreatAsEsm: [".ts"]
};