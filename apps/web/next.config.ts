import type { NextConfig } from 'next';
import { IP_URL } from './src/constants/url';
import bundleAnalyzer from '@next/bundle-analyzer';

const ip = new URL(IP_URL).hostname;

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  allowedDevOrigins: [ip],
};

export default withBundleAnalyzer(nextConfig);
