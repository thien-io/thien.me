import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Thien",
  description: "Tennis and pickleball coach based in Connecticut.",
  metadataBase: new URL("https://thien.me"),
  openGraph: {
    title: "Thien",
    description: "Tennis and pickleball coach based in Connecticut.",
    url: "https://thien.me",
    siteName: "thien.me",
    locale: "en_US",
    type: "website",
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
