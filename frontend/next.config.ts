import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 既存の設定
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      lightningcss: false,
    };
    return config;
  },
};

export default withFlowbiteReact(nextConfig);
