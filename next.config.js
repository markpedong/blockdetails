/** @type {import('next').NextConfig} */
const nextConfig = {
	// Enable source map if needed
	productionBrowserSourceMaps: true,
	reactStrictMode: false,
	images: {
		domains: ['assets.coingecko.com', 's2.coinmarketcap.com']
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/cryptocurrency/coins',
				permanent: true
			},
			{
				source: '/cryptocurrency',
				destination: '/cryptocurrency/coins',
				permanent: true
			}
		]
	}
}

module.exports = nextConfig
