import type { Metadata } from "next";
import { AdminTestimonialsClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin · Testimonials",
  robots: { index: false, follow: false },
};

export default function AdminTestimonialsPage() {
  return <AdminTestimonialsClient />;
}
