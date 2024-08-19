/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // productionBrowserSourceMaps: true,
  output: "standalone",
};

export default nextConfig;
