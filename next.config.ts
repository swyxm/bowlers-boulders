import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	outputFileTracingRoot: path.join(__dirname),
	experimental: {
	},
	webpack: (config, { dev, isServer }) => {
		config.cache = false;
		return config;
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	eslint: {
		ignoreDuringBuilds: false,
	},
};

export default nextConfig;
