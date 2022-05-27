import {
  useAddress,
  useMetamask,
  useNetworkMismatch,
  ChainId,
  useNetwork,
  useNFTDrop,
} from "@thirdweb-dev/react";

import { useState, useEffect } from "react";

// truncates the address so it displays in a nice format
function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Home() {
  // allow user to connect to app with metamask, and obtain address
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const networkMismatched = useNetworkMismatch();
  const [, switchNetwork] = useNetwork(); // Switch network

  // Replace this address with your NFT Drop address!
  const editionDrop = useNFTDrop(
    "0x47FD86648a1A316e091C73B49D5c6C17d0aCF4c1"
  );
  const [checking, setChecking] = useState(true);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // If they don't have an connected wallet, return
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const nfts = await editionDrop.getOwned(address);
        setHasClaimedNFT(nfts?.length > 0);
        setChecking(false);
        setIsClaiming(false);
      } catch (error) {
        setHasClaimedNFT(false);
        setChecking(false);
        console.error("Failed to get NFTs", error);
      }
    };
    checkBalance();
  }, [
    address,
    connectWithMetamask,
    networkMismatched,
    editionDrop,
    switchNetwork,
  ]);

  const mintNft = async () => {
    try {
      // If they don't have an connected wallet, ask them to connect!
      if (!address) {
        connectWithMetamask();
        return;
      }

      // Ensure they're on the right network (mumbai)
      if (networkMismatched) {
        switchNetwork(ChainId.Mumbai);
        return;
      }

      setIsClaiming(true);
      await editionDrop.claim(1);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  //if there isn't a wallet connected, display our connect MetaMask button
  if (!address) {
    return (
      <div>
        <div className="container">
          <span>
            <img class="opensea-icon" src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Transparent%20White.png" /> View <a href="https://testnets.opensea.io/collection/batz-defi" target="_blank">defi.bats</a> on OpenSea!
          </span>
        </div>
        <div className="container" id="main">
          <h1>🦇 batz.defi NFT Lounge 🕸️</h1>
          <h1>🍸🦐 🚬</h1>
          <h2> Own one of the batz,<br />get access to the cave.</h2>
          <button className="btn" onClick={connectWithMetamask}>
            Connect MetaMask
          </button>
          <br />
          <br />
        </div>
        <div className="container">
          <img class="cryptobatz-icon" src="https://www.cryptobatz.com/images/team/ozzy.png" />
          <div class="left">Hey! We are not alone in Metaverse,</div>
          <div class="right">Check out <a href="https://cryptobatz.com" target="_blank">these cool batz</a> also! </div>
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="container">
        <h1>🦇 batz.defi NFT Lounge 🕸️</h1>
        <h1>🍸🦐 🚬</h1>
        <p>Checking your wallet...</p>
      </div>
    );
  }

  // if the user is connected and has an NFT from the drop, display text
  if (hasClaimedNFT) {
    return (
      <div className="container">
        <h1>🦇 batz.defi NFT Lounge 🕸️</h1>
        <h1>🍸🦐 🚬</h1>
        <table>
          <tr>
            <tc><strong>cost</strong>  - </tc>
            <tc>0.01ETH / 50$</tc>
          </tr>
          <tr>
            <tc><strong>gain</strong> - </tc>
            <tc>0.001ETH / 20$</tc>
          </tr>
        </table>
        <img class="batz-main-image" src="https://lh3.googleusercontent.com/8xhM8r2ih8JcM9H_lT4I_FoZQK6tDKCFLwxDx3HYI9x48gxbV4mEVja7ojDb3av4g0Z3AM_5_1-MeSgeca-GtFLWTbzFSegl7Gif=s0" />
      </div>
    );
  }

  // if there are no batz from collection in wallet, display button to mint
  return (


    <div>
        <div className="container">
          <span>
            <img class="opensea-icon" src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Transparent%20White.png" /> View <a href="https://testnets.opensea.io/collection/batz-defi" target="_blank">defi.bats</a> on OpenSea!
          </span>
        </div>
        <div className="container" id="main">
          <h1>🦇 batz.defi NFT Lounge 🕸️</h1>
          <h1>🍸🦐 🚬</h1>
          <p>
        No batz in your wallet <span className="value">{truncateAddress(address)}</span>
        <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;👇
        </p>
      </p>
      <button className="btn" disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "Claiming..." : "Mint a Batz"}
      </button>
          <br />
          <br />
        </div>
        <div className="container">
          <img class="cryptobatz-icon" src="https://www.cryptobatz.com/images/team/ozzy.png" />
          <div class="left">Hey! We are not alone in Metaverse,</div>
          <div class="right">Check out <a href="https://cryptobatz.com" target="_blank">these cool batz</a> also! </div>
        </div>
      </div>
  );
}
