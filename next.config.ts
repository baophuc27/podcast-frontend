import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        // Simple redirect from root to podcast when authenticated
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
};

export default nextConfig;