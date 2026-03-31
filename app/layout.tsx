import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Thien · Tennis Coach",
  description: "Tennis coaching in Connecticut — technique, mental game, all levels.",
  metadataBase: new URL("https://thien.me"),
  openGraph: {
    title: "Thien · Tennis Coach",
    description: "Tennis coaching in Connecticut.",
    url: "https://thien.me",
    siteName: "thien.me",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          @keyframes scrollHint {
            0% { transform: translateY(-100%); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: translateY(200%); opacity: 0; }
          }
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-56 min-h-screen flex flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
