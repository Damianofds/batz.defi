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
  const [nftImage, setNftImage] = useState(false);

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
        setNftImage(nfts.map((e)=>e.metadata.image));
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
            <img className="opensea-icon" src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Transparent%20White.png" /> View <a href="https://testnets.opensea.io/collection/batz-defi" target="_blank">defi.bats</a> on OpenSea!
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
          <img className="cryptobatz-icon" src="https://www.cryptobatz.com/images/team/ozzy.png" />
          <div className="left">Hey! We are not alone in Metaverse,</div>
          <div className="right">Check out <a href="https://cryptobatz.com" target="_blank">these cool batz</a> also! </div>
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
      <div className="scrollable-div">
        <h1>🦇 batz.defi NFT Lounge 🕸️</h1>
        <h1>🍸🦐 🚬</h1>
        <table>
          <tbody>
            <tr>
              <td><img className="batz-main-image" src={nftImage[0]}/></td>
              <td className="td-left">
                <h2><span><strong>GAIN: 10$</strong></span></h2>
                {/* <h4><span><strong>20%</strong></span></h4> */}
                <div>COST: 50$</div>
              </td>
            </tr>
            <tr>
              <td><img className="batz-main-image" src={nftImage[1]}/></td>
              <td className="td-left">
                <h2><span><strong>GAIN: 5$</strong></span></h2>
                {/* <h4><span><strong>10%</strong></span></h4> */}
                <div>COST: 50$</div>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <button className="btn" disabled={isClaiming} onClick={mintNft}>
          {isClaiming ? "Claiming..." : "Mint a Batz"}
        </button>
      </div>
    );
  }

  // if there are no batz from collection in wallet, display button to mint
  return (


    <div>
        <div className="container">
          <span>
            <img className="opensea-icon" src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Transparent%20White.png" /> View <a href="https://testnets.opensea.io/collection/batz-defi" target="_blank">defi.bats</a> on OpenSea!
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
          <img className="cryptobatz-icon" src="https://www.cryptobatz.com/images/team/ozzy.png" />
          <div className="left">Hey! We are not alone in Metaverse,</div>
          <div className="right">Check out <a href="https://cryptobatz.com" target="_blank">these cool batz</a> also! </div>
        </div>
      </div>
  );
}
