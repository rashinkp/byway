import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "platform-lookaside.fbsbx.com", "by-way-uploads.s3.ap-south-1.amazonaws.com", "byway-uploads.s3.amazonaws.com"],
  },
};

export default nextConfig;
