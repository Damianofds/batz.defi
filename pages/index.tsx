import {
  Box,
  Center,
  Container,
  Text,
  Heading,
  Button,
  Link,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import React, { useCallback, useState } from "react";
import * as doorlist from "./doorlist";
import { useTheme } from "@chakra-ui/react";
import { useColorMode, ColorModeScript } from "@chakra-ui/react";


const injectedConnector = new InjectedConnector({ supportedChainIds: [137] });

const OPENSEA_LINK =
  "https://opensea.io/collection/defibats";

/**
 * A React hook that can be used to determine membership status of the connected wallet
 * @returns true, if connected wallet owns the NFT.
 */
const useWalletMembershipAccess = () => {
  const [access, setAccess] = useState(false);
  const { account, library } = useWeb3React();

  if (library && account) {
    // Check wallet for membership nft then update the state.
    var token = doorlist.checkWalletMembership().toString();
    if (token != ""){
      setAccess;
      return token;
    }
  } else {
    // Reset access state if account is disconnected.
    if (access) {
      setAccess(false);
    }
  }

  return access;
};

const Home: NextPage = () => {
  const router = useRouter();
  const { account, library, activate } = useWeb3React();
  const token = useWalletMembershipAccess();
  const hasMembershipAccess = (token == "") ? false : true;

  /* This method uses server-side to validate that the wallet has the required NFT. */
  const enterMemberLounge = useCallback(async () => {
    if (library && account) {
      // Note: request for nonce (one-time use code) to prevent signature reply attack
      const reqAccess = await fetch("/api/request_access");
      const reqAccessResp = await reqAccess.json();

      // Get the connected wallet Signer
      const signer = library.getSigner(account);
      // Signature is used to authenticate the wallet address on the server-side.
      const signature = await signer.signMessage(
        `I want to enter the lounge. one-time access code: ${reqAccessResp.nonce}`
      );

      // Redirect to the lounge page with signature, so that the server side can recover
      // the wallet address who signed the message, then check the balance of the
      // Membership NFT of that wallet to determine if wallet can access the gated content.
      router.push(`/lounge?signature=${signature}`);
    }
  }, [router, library, account]);

  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  return (
    <Container color="purple">
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Head>
        <title>🦇 defibats hall</title>
        <meta name="description" content="grab a defibat if you want to enter!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*  */}
      <Center flexDirection="column">
        <Heading>🦇 defibats NFT Lounge 🕸️</Heading>
        <Heading>🍸🦐 🚬</Heading>
        <Text>
          Own a defibat, get access to the lounge webpage.
        </Text>
        <Link mt={4} href={OPENSEA_LINK} color="yellow" isExternal>
          View defibats on OpenSea
        </Link>
        <Text mt={4} textAlign="center">
          You need to have at least{" "}
          <Text fontWeight="bold" as="span">
            {doorlist.MEMBERSHIP_NFT_TOKEN_COUNT}{" "}
          </Text>
          <Text as="span">of token id </Text>
          <Text fontWeight="bold" as="span">
            {token}{" "}
          </Text>
          <Text as="span">from NFT address </Text>
          <Text fontWeight="bold" as="span">
            {doorlist.MEMBERSHIP_NFT_CONTRACT_ADDRESS}{" "}
          </Text>
        </Text>
      </Center>

      {/* Setup wallet connect button and enter lounge button if wallet is connected.  */}
      <Box mt={20} textAlign="center">
        {account ? (
          <>
            <Text>Wallet: {account}</Text>
            <Text mt={4}>
              Do you have access to the member only lounge?{" "}
              <Button onClick={() => enterMemberLounge()}>
                Attempt to Enter Private Lounge
              </Button>
            </Text>
          </>
        ) : (
          <Button onClick={() => activate(injectedConnector)}>
            Connect Wallet (Polygon only)
          </Button>
        )}
      </Box>

      {/* This method uses client-side to conditionally display information based off
          membership nft in the connected wallet */}
      {hasMembershipAccess ? (
        
        <Center mt={8}>
          <Text textAlign="center">
            It looks like you are one of us...
          </Text>
        </Center>
      ) : null}

      {router.query.denied ? (
        <Text color="red" textAlign="center" mt={8}>
          Access Denied{""}
        </Text>
      ) : null}

    </Container>
    
  );
};

export default Home;