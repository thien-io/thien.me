import '~/styles/globals.css'
import '~/styles/codeblocks.css'
import 'styles/nprogress.css'
import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'

import { MessageProvider } from '~/lib/message'
import Progress from '~/components/ui/NProgress'
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { navigation } from '~/data/nav'
import SEO from '../../next-seo.config'

import { ThemeProvider } from 'next-themes'
import CommandPalette from '~/components/features/command-palette/CommandPalette'

export default function App({
  Component,
  router,
  pageProps: { session, ...pageProps },
}) {
  const pageMeta = (Component as any)?.defaultProps?.meta || {}
  const pageSEO = { ...SEO, ...pageMeta }

  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo {...pageSEO} />
      <MessageProvider>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class">
            <Component {...pageProps} />
            <CommandPalette navigation={navigation} />
            <Progress />
          </ThemeProvider>
        </SessionProvider>
      </MessageProvider>
    </>
  )
}
