import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Thien — Tennis & Pickleball Coach in Connecticut",
    template: "%s — Thien",
  },
  description:
    "RSPA certified tennis and pickleball coach in Connecticut. Private lessons at Twin Lakes Beach Club and Lakeridge. All levels welcome.",
  metadataBase: new URL("https://thien.me"),
  openGraph: {
    title: "Thien — Tennis & Pickleball Coach in Connecticut",
    description:
      "RSPA certified tennis and pickleball coach in Connecticut. Private lessons at Twin Lakes Beach Club and Lakeridge.",
    url: "https://thien.me",
    siteName: "thien.me",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://thien.me",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          @keyframes scrollHint {
            0% { transform: translateY(-100%); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: translateY(200%); opacity: 0; }
          }
        `}</style>
        {/* Clear stale theme/color localStorage keys from old theme switcher */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            localStorage.removeItem('thien-color');
            localStorage.removeItem('theme');
          } catch(e) {}
        `}} />
      </head>
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-56 min-h-screen flex flex-col">
            <div className="flex-1 w-full">{children}</div>
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
