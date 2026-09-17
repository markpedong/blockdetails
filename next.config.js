/** @type {import('next').NextConfig} */
const nextConfig = {
	allowedDevOrigins: ['192.168.1.216'],
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'assets.coingecko.com' },
			{ protocol: 'https', hostname: 's2.coinmarketcap.com' }
		]
	}
}

export default nextConfig
