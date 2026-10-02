import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Use backend URL from env, fallback to localhost for local development
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
