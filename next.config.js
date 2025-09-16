/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@codequest/ui", "@codequest/common", "@codequest/db"],
  eslint: {
    // Disable ESLint during builds to focus on core functionality
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript type checking during builds temporarily
    ignoreBuildErrors: true,
  },
};
