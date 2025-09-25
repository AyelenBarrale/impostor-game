/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint for better builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
