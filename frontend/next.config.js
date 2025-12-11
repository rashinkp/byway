"use strict";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
        ],
        domains: [
            "res.cloudinary.com",
            "platform-lookaside.fbsbx.com",
            "ui-avatars.com"
        ],
        unoptimized: false,
    },
};

module.exports = nextConfig; 
