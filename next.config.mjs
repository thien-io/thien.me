/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "p.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
    ],
  },
  // gray-matter uses fs — make sure it's treated as server-only
  serverExternalPackages: ["gray-matter"],
};

export default nextConfig;
