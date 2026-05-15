import type { NextConfig } from 'next';
import { IP_URL } from './src/constants/url';

const ip = new URL(IP_URL).hostname;

const nextConfig: NextConfig = {
  allowedDevOrigins: [ip],
};

export default nextConfig;
