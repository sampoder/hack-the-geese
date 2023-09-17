import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast';
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Hack The Geese</title>
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
