/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/cryptocurrency",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
