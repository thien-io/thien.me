import clsx from 'clsx';
import NextNProgress from 'nextjs-progressbar';
import * as React from 'react';
import { CgSpinner } from 'react-icons/cg';

import Footer from '~/components/ui/Footer'
import Header from '~/components/ui/header'
import Seo from '~/components/Seo';


import { useThemeContext } from '~/hooks/useTheme'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { systemTheme } = useThemeContext()
  const [isClient, setIsClient] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => setIsClient(false), 500)
  }, [])

  return (
    <>
      {isClient ? (
        <>
          <Seo title="Thien" />
          <div
            className="h-screen w-full overflow-y-auto"
            style={{
              backgroundColor: systemTheme.background.primary,
              color: systemTheme.text.primary,
            }}
          >
            <div className="flex max-w-[500px] flex-wrap items-center justify-center gap-x-8">
              <div className="flex flex-col items-center gap-4">
                <CgSpinner className="animate-spin text-[3rem] text-fg" />
                <p className="hidden">Thien</p>
                <div className="loading font-primary text-fg">
                  Preparing the page for you...
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          className="h-screen w-full overflow-y-auto"
          style={{
            backgroundColor: systemTheme.background.primary,
            color: systemTheme.text.primary,
          }}
        >
          <div className="layout flex h-full flex-col bg-transparent">
            <Header />
            {children}
            <Footer />
          </div>
        </div>
      )}
    </>
  )
}

const progressColors = {
  default: '58 163 193',
  plain: '75 75 75',
  winter: '239 255 253',
  'snowy-night': '231 246 242',
  vintage: '247 236 222',
  vampire: '179 48 48',
  bubblegum: '193 255 207',
  'green-tea': '227 243 172',
  wood: '160 147 125',
  beach: '242 223 58',
  halloween: '245 136 64',
  botanical: '242 240 233',
  'eye-pain': '255 0 231',
};

type ProgressColorType = keyof typeof progressColors;