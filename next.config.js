/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  future: {
    // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
    webpack5: true,
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: [
      'i.scdn.co', // Spotify Album Art
      'pbs.twimg.com',
      'cdn.discordapp.com', // discord url
      'avatars.githubusercontent.com',
      'github.com',
      's3.us-west-2.amazonaws.com', // Images coming from Notion
      'via.placeholder.com', // for articles that do not have a cover image
      'images.unsplash.com', // For blog posts that use an external cover image
      'pbs.twimg.com', // Twitter Profile Picture
      'dwgyu36up6iuz.cloudfront.net',
      'cdn.hashnode.com',
      'res.craft.do',
      'res.cloudinary.com', // Twitter Profile Picture
    ],
  },
  webpack(config) {
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,

      fs: false, // the solution
    }

    return config
  },
}
