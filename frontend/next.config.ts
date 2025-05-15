import type { NextConfig } from "next";

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8000/:path*',
      },
    ];
  },
};

const nextConfig: NextConfig = {
    devIndicators: false
};

export default nextConfig;
