import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  server: {
    hostname: "0.0.0.0",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
