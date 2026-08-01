import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { TabBar } from "@/components/tab-bar";
import { Footer } from "@/components/footer";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
});
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-dm-mono" });

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
    <html lang="en" className={`${bebas.variable} ${dmSans.variable} ${dmMono.variable}`}>
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
        <SiteNav />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <TabBar />
      </body>
    </html>
  );
}
