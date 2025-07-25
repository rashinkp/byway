import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dxogdfuse/image/upload/**',
      },
      // Add other remote patterns as needed
    ],
    domains: [
      "res.cloudinary.com",
      "platform-lookaside.fbsbx.com",
      "by-way-uploads.s3.ap-south-1.amazonaws.com",
      "byway-uploads.s3.amazonaws.com",
      "byway.ddns.net"
    ],
  },
};

export default nextConfig;
