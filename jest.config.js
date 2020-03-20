module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./jest-setup-file.ts"],
  moduleDirectories: ["node_modules", "src"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>", "./src/interface"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  verbose: true,
};