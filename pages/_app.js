import React from "react";
import { Home, TheCave } from "./Home";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "./styles.css";

function MyApp({ Component, pageProps }) {
  // This is the chainId your dApp will work on.
  const activeChainId = ChainId.Mumbai;
  return (
      <React.StrictMode>
        <ThirdwebProvider desiredChainId={activeChainId}>
          <Home />
          <TheCave />
        </ThirdwebProvider>
      </React.StrictMode>
  );
}

export default MyApp