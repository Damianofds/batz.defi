import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3React } from "@web3-react/core";

// Polygon only
export const MEMBERSHIP_NFT_CONTRACT_ADDRESS = "0x2953399124F0cBB46d2CbACD8A89cF0599974963";
const NFT_TOKEN_ID_DEFIBAT_PILOT_1 = "79078668607366417989958799571951224290491291446228305177201997863554643918849";
const NFT_TOKEN_ID_DEFIBAT_PILOT_2 = "79078668607366417989958799571951224290491291446228305177201997864654155546625";
const NFT_TOKEN_ID_DEFIBAT_PILOT_3 = "79078668607366417989958799571951224290491291446228305177201997865753667174401"
const NFT_TOKEN_ID_DEFIBAT_PILOT_4 = "79078668607366417989958799571951224290491291446228305177201997866853178802177";
const NFT_TOKEN_ID_DEFIBAT_PILOT_5 = "79078668607366417989958799571951224290491291446228305177201997867952690429953";
export const NFT_TOKEN_ID_MEMBERSHIP_LIST = [NFT_TOKEN_ID_DEFIBAT_PILOT_1, NFT_TOKEN_ID_DEFIBAT_PILOT_2, NFT_TOKEN_ID_DEFIBAT_PILOT_3, NFT_TOKEN_ID_DEFIBAT_PILOT_4, NFT_TOKEN_ID_DEFIBAT_PILOT_5] as const;

export const MEMBERSHIP_NFT_TOKEN_COUNT = 1;

export async function checkWalletMembership() {

    const { account, library, activate } = useWeb3React();
    // get the connected wallet as a signer
    const signer = library.getSigner(account);

    /*
      Our SDK takes in a valid Signer or Provider.
      A signer can perform READ and WRITE calls on the blockchain.
      A provider can only perform READ calls on the blockchain.
      Read more: https://docs.ethers.io/v5/api/signer
      */
    const module = new ThirdwebSDK(signer).getCollectionModule(
      MEMBERSHIP_NFT_CONTRACT_ADDRESS
    );

    for(var i=0; i <NFT_TOKEN_ID_MEMBERSHIP_LIST.length; i++){
      var balance = (await module.balance(NFT_TOKEN_ID_MEMBERSHIP_LIST[i])).toNumber();
      if (balance >= MEMBERSHIP_NFT_TOKEN_COUNT) {
        return NFT_TOKEN_ID_MEMBERSHIP_LIST[i];
      } else {
        return "";
      }
    }
  }