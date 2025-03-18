import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: true,
  compress: true,
  
  // Existing redirect code
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/podcast',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'auth_token',
            value: 'authenticated'
          }
        ]
      },
    ];
  },
  
  // Add this if you're using API routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Forwarded-Host', value: 'preserve' },
          { key: 'X-Forwarded-For', value: 'preserve' },
          { key: 'X-Real-IP', value: 'preserve' },
        ],
      },
    ]
  },
};

export default nextConfig;