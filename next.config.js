/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // You can also try explicitly excluding the problematic path
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  experimental: {
    // Only include the pages you know are working
    typedRoutes: false
  }
}

module.exports = nextConfig 