import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home";
import reportWebVitals from "./reportWebVitals";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import GitHubLink from "./GitHubLink";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

ReactDOM.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Home />
      <GitHubLink />
    </ThirdwebProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();