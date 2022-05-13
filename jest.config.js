module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./test/jest-setup-file.ts"],
  moduleDirectories: ["node_modules"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>", "<rootDir>/src/**/**/**.**"],
  moduleNameMapper: {
    "^.*interfaces/(.*)": "<rootDir>/src/interfaces/$1",
    "^.*validator/(.*)": "<rootDir>/src/validator/$1",
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  verbose: true,
};
