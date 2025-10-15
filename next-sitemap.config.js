/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://vangbaccongngoc.com', // đổi thành domain thật của bạn
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.8,
  transform: async (config, path) => {
    return {
      loc: path, // URL
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    }
  },
};
