import "styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { SnackbarProvider } from "notistack";
import { BaseAppProvider } from "baseapp-nextjs-core";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import createEmotionCache from "styles/createEmotionCache";
import theme from "styles/theme";
import Div100vh from "react-div-100vh";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string, {
  stripeAccount: process.env.NEXT_PUBLIC_STRIPE_CONNECTED_ACCOUNT_ID,
});

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <Elements stripe={stripePromise}>
      <BaseAppProvider pageProps={pageProps}>
        <SnackbarProvider maxSnack={3}>
          <CacheProvider value={emotionCache}>
            <Head>
              <title>Why The Face</title>
              <meta name="description" content="A Practical Guide to Understanding Health & Personality Through Facial Analysis" />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://whythefaceapp.com/" />
              <meta property="og:title" content="Why The Face" />
              <meta property="og:site_name" content="Why The Face" />
              <meta property="og:image" content="https://whythefaceapp.com/images/social.png" />
              <link rel="image_src" href="https://whythefaceapp.com/images/social.png" />
              <meta property="image" content="https://whythefaceapp.com/images/social.png" />
              <meta itemProp="image" content="https://whythefaceapp.com/images/social.png" />
              <meta name="robots" content="max-image-preview:large" />
              <meta property="og:image:type" content="image/png" />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              <meta property="og:description" content="A Practical Guide to Understanding Health & Personality Through Facial Analysis" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no"
              />
              <link rel="icon" href="/images/wtffavicon.svg" />
              <link rel="apple-touch-icon" href="/icon.png" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
              <meta name="apple-mobile-web-app-title" content="WhyTheFace" />
              <link rel="manifest" href="/manifest.json" />
            </Head>

            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Div100vh>
                <Component {...pageProps} />
              </Div100vh>
            </ThemeProvider>
          </CacheProvider>
        </SnackbarProvider>
      </BaseAppProvider>
    </Elements>
  );
};

export default App;
