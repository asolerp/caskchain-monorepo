import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createWeb3State,
  loadContract,
  loadContractByAddress,
  Web3State,
} from "./utils";

import { CcNftContract } from "../../types/ccNftContract";
import { NftVendorContract } from "../../types/nftVendorContract";
import { NftOffersContract } from "../../types/nftOffersContract";

// import { NftFractionsVendorContract } from '../../types/nftFractionsVendorContract'
import { NftFractionsFactoryContract } from "../../types/nftFractionsFactoryContract";
import { useAccount, useProvider } from "wagmi";
import { Provider, Signer } from "@wagmi/core";
import { deleteCookie } from "cookies-next";

import axiosClient from "../../lib/fetcher/axiosInstance";

import { fetchSigner } from "@wagmi/core";

const pageReload = () => {
  window.location.reload();
};

const accountChanged = (logout: any) => {
  logout();
  window.location.reload();
};

const setGlobalListeners = (provider: any, logout: any) => {
  provider.on("chainChanged", pageReload);
  provider.on("accountsChanged", () => accountChanged(logout));
  provider.on("disconnect", () => console.log("disconnect"));
};

const removeGlobalListeners = (provider: Provider) => {
  provider?.removeListener("chainChanged", pageReload);
  provider?.removeListener("accountsChnaged", pageReload);
  provider?.removeListener("disconnect", pageReload);
};

const Web3Context = createContext<Web3State | null>(null);

interface Props {
  children: ReactNode;
}

const Web3Provider: React.FC<Props> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<any>(null);
  const provider = useProvider();
  const { address } = useAccount();

  const logout = async (callback: any) => {
    deleteCookie("token");
    deleteCookie("refresh-token");
    callback && callback();
    // dispatch({
    //   type: GlobalTypes.SET_USER,
    //   payload: { user: null },
    // })

    const account = address;
    await axiosClient.get(`/api/user/${account}/cleanTokens`);
  };

  useEffect(() => {
    async function initWeb3() {
      try {
        const ccNft = await loadContract("CCNft");
        const nftVendor = await loadContract("NftVendor");
        const nftOffers = await loadContract("NftOffers");

        const nftFractionsFactory = await loadContract("NftFractionsFactory");
        const nftFractionsVendor = await loadContract("NftFractionsVendor");

        const nftFactionToken = async (address: string) =>
          await loadContractByAddress("NftFractionToken", provider, address);

        const signer = (await fetchSigner()) as unknown as Signer;

        const sigendNftVendorContract = nftVendor.connect(signer);
        const signedCCNftContract = ccNft.connect(signer);
        const signedNftOffersContract = nftOffers.connect(signer);
        const signednftFractionsVendor = nftFractionsVendor.connect(signer);
        const signednftFractionsFactory = nftFractionsFactory.connect(signer);
        const signedNftFractionToken = async (address: string) =>
          await nftFactionToken(address);

        // const signedNftFractionToken = async (tokenAddress: string) => {
        //   console.log('HOLA FROM SIGNED NFT FRACTION TOKEN')
        //   const res = await fetch(`/contracts/NftFractionToken.json`)
        //   const Contract = await res.json()

        //   const TokenContract = new ethers.Contract(
        //     tokenAddress,
        //     Contract.abi,
        //     provider
        //   )

        //   const _signedTokenContract = TokenContract.connect(signer)
        //   console.log(_signedTokenContract, 'signedTokenContract')
        //   return _signedTokenContract
        // }

        setGlobalListeners(window.ethereum, logout);
        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            // erc20Contracts: { [usdtERC20.address]: sigendNftVendorContract },
            nftFractionToken: signedNftFractionToken,
            nftFractionsVendor: signednftFractionsVendor as unknown as any,
            nftFractionsFactory:
              signednftFractionsFactory as unknown as NftFractionsFactoryContract,
            ccNft: signedCCNftContract as unknown as CcNftContract,
            nftVendor: sigendNftVendorContract as unknown as NftVendorContract,
            nftOffers: signedNftOffersContract as unknown as NftOffersContract,
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
    return () => removeGlobalListeners(provider);
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export default Web3Provider;
