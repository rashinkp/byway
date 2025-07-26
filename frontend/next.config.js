"use strict";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/dxogdfuse/image/upload/**',
            },
        ],
        domains: [
            "res.cloudinary.com",
            "platform-lookaside.fbsbx.com",
            "by-way-uploads.s3.ap-south-1.amazonaws.com",
            "byway-uploads.s3.amazonaws.com",
            "byway.ddns.net",
            "ui-avatars.com"
        ],
    },
};

module.exports = nextConfig; 
