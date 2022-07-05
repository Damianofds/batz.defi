import {
    useAddress,
    useMetamask,
    useNetworkMismatch,
    ChainId,
    useNetwork,
    useNFTDrop,
  } from '@thirdweb-dev/react';
  
  import { useState, useEffect } from "react";
  
  // truncates the address so it displays in a nice format
  function truncateAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  import { mintNft } from "./services.js";
  
  export function TheCave(){  
    
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
    const [nftImage, setBat] = useState(false);
  
    useEffect(() => {
      // If they don't have a connected wallet, return
      if (!address) {
        return;
      }
      const checkBalance = async () => {
        try {
          const nfts = await editionDrop.getOwned(address);
          setHasClaimedNFT(nfts?.length > 0);
          setChecking(false);
          setIsClaiming(false);
          setBat(nfts.map(
            (e)=>({
            "name":e.metadata.name,
            "image":e.metadata.image
            })
          ));
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

    // if the user is connected and has an NFT from the drop, display text
    if (hasClaimedNFT) {
      if(!nftImage){
        return null;
      }
      return (
          <div className="container" id="main">
          <h1>🦇🕸️</h1>
          <img src="batz.defi-logo.svg"/>
          <h1>🍸🦐 🚬</h1>
          <br />
          <button className="btn" disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? "Claiming..." : "Mint a Batz"}
          </button>
          <br />
          <div className="scrollable-div">
            <table >
              <tbody>
                {nftImage.map((item) => (
                  <tr>
                    <td><img className="batz-main-image" src={item.image}/></td>
                    <td className="td-left">
                      <div><i>NAME</i></div>
                      <div><span>&nbsp;&nbsp;&nbsp;</span>{item.name}</div>
                      <div><i>VALUE</i></div>
                      <span>&nbsp;&nbsp;&nbsp;<strong>60$</strong></span><span className="gain"><strong>&nbsp;+10$</strong><strong>&nbsp;+20%</strong></span>
                    </td>
                  </tr>  
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <button className="btn" disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? "Claiming..." : "Mint a Batz"}
          </button>
          <br />
        </div>
      );
    }
    return null;
  }  