import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createDefaultState,
  createWeb3State,
  loadContract,
  Web3State,
} from "./utils";

import { CcNftContract } from "contracts/types/ccNftContract";
import { NftVendorContract } from "contracts/types/nftVendorContract";
import { NftOffersContract } from "contracts/types/nftOffersContract";

import { NftFractionsFactoryContract } from "@_types/nftFractionsFactoryContract";

import { getMagicProvider, getWeb3 } from "caskchain-lib";

const Web3Context = createContext<Web3State>(createDefaultState());

interface Props {
  magic: any;
  children: ReactNode;
}

const Web3Provider: React.FC<Props> = ({ magic, children }) => {
  const [web3Api, setWeb3Api] = useState<any>(createDefaultState());
  const [web3, setWeb3] = useState<any>(null);

  useEffect(() => {
    getWeb3(magic).then(setWeb3);
  }, []);

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = getMagicProvider(magic);

        const ccNft = await loadContract("CCNft", web3);
        const nftVendor = await loadContract("NftVendor", web3);
        const nftOffers = await loadContract("NftOffers", web3);
        const mockUSDT = await loadContract("MockUSDT", web3);

        const nftFractionsFactory = await loadContract(
          "NftFractionsFactory",
          web3
        );
        const nftFractionsVendor = await loadContract(
          "NftFractionsVendor",
          web3
        );
        setWeb3Api(
          createWeb3State({
            web3,
            setWeb3,
            provider,
            erc20Contracts: { USDT: mockUSDT },
            // nftFractionToken: signedNftFractionToken,
            nftFractionsVendor: nftFractionsVendor as unknown as any,
            nftFractionsFactory:
              nftFractionsFactory as unknown as NftFractionsFactoryContract,
            ccNft: ccNft as unknown as CcNftContract,
            nftVendor: nftVendor as unknown as NftVendorContract,
            nftOffers: nftOffers as unknown as NftOffersContract,
            isLoading: false,
          })
        );
      } catch (e: any) {
        console.error("ERROR", e.message);
        setWeb3Api((api: any) =>
          createWeb3State({
            ...(api as any),
            isLoading: false,
          })
        );
      }
    }
    initWeb3();
  }, [web3]);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export function useProvider() {
  const { provider } = useWeb3();
  return provider;
}

export function useWeb3Instance() {
  const { web3, setWeb3 } = useWeb3();
  return {
    web3,
    setWeb3,
  };
}

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;
