// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Keep the Metro server root pinned to this package so the app entry (index.ts)
// resolves against apps/native, not the monorepo root.
config.watchFolders = [projectRoot];

// Resolve modules from both the package and the monorepo root node_modules (pnpm).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

module.exports = config;
