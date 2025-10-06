export const metaData = {
  baseUrl: "https://thientran.io/",
  title: "Thien",
  name: "Thien",
  ogImage: "/opengraph-image.png",
  description:
    "tennis coach and web developer",
};

export const socialLinks = {
  twitter: "https://x.com/thien_io",
  github: "https://github.com/thien-io",
  discord: "https://discord.gg/thien-io",
  instagram: "https://www.instagram.com/thientran.io",
  linkedin: "https://www.linkedin.com/in/thienio/",
  email: "mailto:hello@thientran.io",
};


export const config = {
  github: {
    user: {
      endpoint: 'https://api.github.com/users/thien-io',
    },
    repo: {
      endpoint: 'https://api.github.com/users/thien-io/repos',
    },
  },
  game: {
    discordId: '925868267690672208',
    title: {
      hearthstone: 'Hearthstone',
    },
  },
  socket: {
    type: {
      init: 'INIT_STATE',
      update: 'PRESENCE_UPDATE',
    },
  },
}
const dev = process.env.NODE_ENV !== 'production'
export const basePath = dev
  ? 'http://localhost:3000'
  : process.env.PRODUCTION_URL
