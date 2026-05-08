import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/rwvca",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
