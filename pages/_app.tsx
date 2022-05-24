import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home";
import reportWebVitals from "../components/reportWebVitals";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import GitHubLink from "../components/GitHubLink";
import "./styles.css";
import { AppProps } from "next/app";


function MyApp({ Component, pageProps }: AppProps) {
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

export default MyApp;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
