import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `https://thien.me/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const routes = [
    { url: "https://thien.me", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "https://thien.me/about", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "https://thien.me/coaching", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "https://thien.me/pricing", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "https://thien.me/booking", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "https://thien.me/booking/twin", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "https://thien.me/booking/lakeridge", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "https://thien.me/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "https://thien.me/testimonial", priority: 0.5, changeFrequency: "weekly" as const },
    { url: "https://thien.me/ladder", priority: 0.5, changeFrequency: "daily" as const },
  ].map((route) => ({ ...route, lastModified: new Date() }));

  return [...routes, ...posts];
}
