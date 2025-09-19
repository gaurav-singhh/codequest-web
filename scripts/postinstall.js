// Cross-platform postinstall script for Prisma
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

if (process.env.CI !== "true") {
  // Only run from the root, not from workspace installs
  const isRoot = process.cwd() === path.resolve(__dirname, "..");
  if (!isRoot) {
    // Don't run during workspace installs
    process.exit(0);
  }
  // Only run prisma generate if the required WASM file exists
  const wasmFile = path.join(
    __dirname,
    "..",
    "packages",
    "db",
    "node_modules",
    "@prisma",
    "client",
    "runtime",
    "query_engine_bg.postgresql.wasm-base64.js"
  );
  if (fs.existsSync(wasmFile)) {
    execSync(
      "npx prisma generate --schema=packages/db/prisma/schema.prisma",
      { stdio: "inherit" }
    );
  } else {
    console.log("Required Prisma WASM file not found. Skipping prisma generate.");
  }
}
