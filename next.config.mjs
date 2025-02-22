/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    turbo: false, // Disable Turbopack
  },
};

export default nextConfig;
