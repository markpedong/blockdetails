/** @type {import('next').NextConfig} */

const nextConfig = {
	async redirects() {
		return [
			{
				source: '/',
				destination: '/cryptocurrency',
				permanent: true
			}
		]
	},
	images: {
		domains: ['s2.coinmarketcap.com']
	}
}

module.exports = nextConfig
