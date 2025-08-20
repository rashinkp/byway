"use strict";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/dxogdfuse/image/upload/**',
            },
            {
                protocol: 'https',
                hostname: 'by-way-uploads.s3.ap-south-1.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'byway-uploads.s3.amazonaws.com',
                pathname: '/**',
            },
        ],
        domains: [
            "res.cloudinary.com",
            "platform-lookaside.fbsbx.com",
            "byway.ddns.net",
            "ui-avatars.com"
        ],
        unoptimized: false,
    },
};

module.exports = nextConfig; 
