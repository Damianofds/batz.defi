import { ThirdwebSDK } from "@3rdweb/sdk";
import { Center, Container, Text, Heading, Box, Stack, Link } from "@chakra-ui/react";
import { ethers } from "ethers";
import { verifyMessage } from "@ethersproject/wallet";
import type { InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import * as doorlist from "./doorlist";
import { useTheme } from "@chakra-ui/react";
import { useColorMode, ColorModeScript } from "@chakra-ui/react";

const Home: NextPage = ({
  signature,
  walletAddress,
  balance,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  useEffect(() => {
    // remove `signature` query params on load
    if (router.query.signature) {
      router.replace("/lounge", undefined, { shallow: true });
    }
  }, [router]);

  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  return (
    <Container color="purple">
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Head>
        <title>🦇 defibats Lounge</title>
        <meta name="description" content="we are a club of gentlepeople" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*  */}
      <Center flexDirection="column">
        <Stack direction="row">
          <Text fontSize="xs">Signature: {signature}</Text>
          <Text fontSize="xs">Address: {walletAddress}</Text>
          <Text fontSize="xs">Balance: {balance}</Text>
        </Stack>

        <Box mt={8} />

        <Center mt={8}>
          <Text textAlign="center">
            Everybody can visit my website, but only members of cryptobats can reach it from this exact link! 👉👉👉 {" "}
            <Link color="purple" href="https://damianofds.github.io/" isExternal>
            https://damianofds.github.io/
            </Link>
          </Text>
        </Center>
      </Center>
    </Container>
  );
};

export async function getServerSideProps(context: any) {
  const signature = context.query.signature;
  if (!signature) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const provider = ethers.getDefaultProvider("https://polygon-rpc.com");
  const module = new ThirdwebSDK(provider).getCollectionModule(
    doorlist.MEMBERSHIP_NFT_CONTRACT_ADDRESS
  );

  //get the nonce from the previous GET /request_access request.
  const reqAccessResp = "666";
  const expectedSignMessage = `I want to enter the lounge. Fake one-time access code: ${reqAccessResp}`;

  const walletAddress = verifyMessage(expectedSignMessage, signature);
  if (doorlist.checkWalletMembership().toString() == "") {
    return {
      redirect: {
        destination: "/?denied=true",
        permanent: false,
      },
    };
  }

  return {
    // Will be passed to the page component as props
    props: { signature, walletAddress, balance: 1 /* FIXME RETURN RIGHT BALANCE */ },
  };
}

export default Home;
