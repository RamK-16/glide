import "../styles/globals.css";
import type { AppProps } from "next/app";

import "@glideappsfinal/glide-data-grid/dist/index.css";

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
