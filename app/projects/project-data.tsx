export interface Project {
  title: string;
  year: number;
  description: string;
  url: string;
}

export const projects: Project[] = [
  {
    title: "Modern Tennis & Pickeball",
    year: 2025,
    description:
      "Modern Pickball and Tennis Programs for children and adults.",
    url: "https://modernpickle.com/",
  },
  {
    title: "thien.me",
    year: 2021,
    description:
      "overengineered portfoliio built with nextjs, tailwaindcss, supabase, notion, spotify, and more.",
    url: "https://thien.me/",
  },
  {
    title: "Tennis Social",
    year: 2021,
    description:
      "Tennis Social networking app. Work in progress.",
    url: "https://tennis.so/",
  },
];
