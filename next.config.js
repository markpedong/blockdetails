/** @type {import('next').NextConfig} */

const nextConfig = {
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
	},
	images: {
		domains: ['assets.coingecko.com', 's2.coinmarketcap.com']
	}
}

module.exports = nextConfig
