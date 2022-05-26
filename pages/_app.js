import React from "react";
import Home from "./Home";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import GitHubLink from "../components/GitHubLink";
import "./styles.css";

function MyApp({ Component, pageProps }) {
  // This is the chainId your dApp will work on.
  const activeChainId = ChainId.Mumbai;
  return (
      <React.StrictMode>
        <ThirdwebProvider desiredChainId={activeChainId}>
          <Home />
          <GitHubLink />
        </ThirdwebProvider>
      </React.StrictMode>
  );
}

export default MyApp