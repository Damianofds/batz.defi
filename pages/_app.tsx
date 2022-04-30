import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import theme from "../components/Theme";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, "any");
  return library;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
