import { CanvasProvider } from "@/context/CanvasContext";
import "../styles/FileUpload.module.css";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <CanvasProvider>
      <Component {...pageProps} />
    </CanvasProvider>
  );
}
