import type { Metadata, Viewport } from "next";
import { Source_Serif_4 } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingProvider } from "@/components/booking/booking-provider";
import { Reveals } from "@/components/reveals";

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Thien — Tennis & Pickleball Coach in Connecticut",
    template: "%s — Thien",
  },
  description:
    "RSPA certified tennis and pickleball coach in Connecticut. Private lessons at Twin Lakes Beach Club and Lakeridge, $100 an hour. All levels welcome.",
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

export const viewport: Viewport = {
  themeColor: "#e4e4df",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${serif.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Opt into entrance animations only when script runs, so content never stays hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');try{localStorage.removeItem('thien-color');localStorage.removeItem('theme')}catch(e){}`,
          }}
        />
      </head>
      <body>
        <BookingProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </BookingProvider>
        <Reveals />
      </body>
    </html>
  );
}
