import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // The dev badge sat on top of the footer and sidebar text.
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
