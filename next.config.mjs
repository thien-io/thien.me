/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["geist"],
  async redirects() {
    // Booking, pricing, about and messages now live on the home page; old links land
    // on the right section, and booking links open the booking dialog.
    return [
      { source: "/book",                       destination: "/?book=open",        permanent: false },
      { source: "/bookings",                   destination: "/?book=open",        permanent: false },
      { source: "/booking",                    destination: "/?book=open",        permanent: false },
      { source: "/booking/twin",               destination: "/?book=twin",        permanent: false },
      { source: "/booking/lakeridge",          destination: "/?book=lakeridge",   permanent: false },
      { source: "/booking/farmington-valley",  destination: "/?book=farmington",  permanent: false },
      { source: "/booking/fern-park",          destination: "/?book=fern-park",   permanent: false },
      { source: "/pricing",                    destination: "/#rates",            permanent: false },
      { source: "/about",                      destination: "/#about",            permanent: false },
      { source: "/coaching",                   destination: "/#courts",           permanent: false },
      { source: "/testimonials",               destination: "/#messages",         permanent: false },
      { source: "/blog",                       destination: "/",                  permanent: false },
      { source: "/blog/:slug*",                destination: "/",                  permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "p.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
    ],
  },
};

export default nextConfig;
