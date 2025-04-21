import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["btxvsdoiswwlufmfghlz.supabase.co"], // Supabase のホスト名を追加
  },
};

export default withFlowbiteReact(nextConfig);
