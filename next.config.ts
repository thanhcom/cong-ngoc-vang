// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true, // true nếu muốn redirect vĩnh viễn (301)
      },
    ];
  },
};

module.exports = nextConfig;
