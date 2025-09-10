import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	outputFileTracingRoot: path.join(__dirname),
	// Disable experimental features that cause issues
	experimental: {
		// Disable all experimental features
	},
	// Use stable webpack instead of turbopack
	webpack: (config, { dev, isServer }) => {
		// Ensure stable webpack configuration
		config.cache = false;
		return config;
	},
	// Use default minification
	// Ensure stable builds
	typescript: {
		ignoreBuildErrors: false,
	},
	eslint: {
		ignoreDuringBuilds: false,
	},
};

export default nextConfig;
