import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://thien.me", priority: 1.0, changeFrequency: "weekly", lastModified: new Date() },
  ];
}
