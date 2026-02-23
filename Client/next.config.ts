import type { NextConfig } from "next";

const nextConfig: NextConfig = {


    experimental: {
      optimizePackageImports: ['lucide-react', '@mui/material']
    }
  
};

export default nextConfig;
