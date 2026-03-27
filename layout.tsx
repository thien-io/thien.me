import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Thien · Tennis Coach",
  description: "Tennis coaching, mindset, and movement — based in New York.",
  metadataBase: new URL("https://thien.me"),
  openGraph: {
    title: "Thien · Tennis Coach",
    description: "Tennis coaching, mindset, and movement.",
    url: "https://thien.me",
    siteName: "thien.me",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-60 min-h-screen">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
