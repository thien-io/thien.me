import './global.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from './components/theme-switch';
import { metaData } from './config';
import { ViewTransitions } from 'next-view-transitions';

export const metadata: Metadata = {
  metadataBase: new URL(metaData.baseUrl),
  title: {
    default: metaData.title,
    template: `%s | ${metaData.title}`,
  },
  description: metaData.description,
  openGraph: {
    images: metaData.ogImage,
    title: metaData.title,
    description: metaData.description,
    url: metaData.baseUrl,
    siteName: metaData.name,
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: metaData.name,
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions >
      <html lang='en' className={cx(GeistSans.variable, GeistMono.variable) }>
        <head>
          <link
            rel='alternate'
            type='application/rss+xml'
            href='/rss.xml'
            title='RSS Feed'
          />
          <link
            rel='alternate'
            type='application/atom+xml'
            href='/atom.xml'
            title='Atom Feed'
          />
          <link
            rel='alternate'
            type='application/feed+json'
            href='/feed.json'
            title='JSON Feed'
          />
        </head>
        <body className='flex h-screen items-center justify-center flex-col overflow-x-hidden '>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <main className='flex flex-1 flex-col gap-4  pt-0 w-full h-screen'>
              

                <div className=' w-full   overflow-x-hidden'>{children}</div>
             
              <Analytics />
              <SpeedInsights />
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
