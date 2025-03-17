import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        // Only redirect if not coming from podcast
        source: '/',
        destination: '/podcast',
        permanent: true,
        // Skip redirect if there's a redirected parameter
        has: [
          {
            type: 'query',
            key: 'redirected',
            value: 'true',
            // Skip the redirect if this query parameter exists
            // This prevents the redirect loop
            negative: true
          }
        ]
      },
    ];
  },
};

export default nextConfig;