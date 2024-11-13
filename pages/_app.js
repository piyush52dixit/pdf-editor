import { CanvasProvider } from "../src/context/CanvasContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CanvasProvider>
        <Component {...pageProps} />
      </CanvasProvider>
    </>
  );
}

export default MyApp;
