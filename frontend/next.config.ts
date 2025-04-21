import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["btxvsdoiswwlufmfghlz.supabase.co"],
  },
};

export default withFlowbiteReact(nextConfig);
