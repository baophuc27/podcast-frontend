import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        // Only redirect if not coming from podcast and not already redirected
        source: '/',
        destination: '/podcast',
        permanent: true,
        // Skip redirect if there's a redirected parameter OR if the user is not authenticated
        has: [
          {
            type: 'query',
            key: 'redirected',
            // If redirected=true exists, skip the redirect
            value: 'true',
            negative: true
          },
          {
            type: 'cookie',
            key: 'auth_token',
            // Only redirect if auth_token exists
            value: 'authenticated'
          }
        ]
      },
    ];
  },
};

export default nextConfig;