import { setupHooks, Web3Hooks } from "@hooks/web3/setupHooks";

import { Web3Dependencies } from "@_types/hooks";
import { Contract } from "ethers";

export const AcceptedChainIds = [1337, 80001];

export type Web3Params = {
  ethereum: any;
  provider: any;
  contract: Contract | null;
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Web3State = {
  isLoading: boolean;
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const createDefaultState = () => {
  return {
    nftFractionsFactory: null,
    nftFractionsVendor: null,
    nftFractionToken: null,
    ethereum: null,
    provider: null,
    ccNft: null,
    nftVendor: null,
    isLoading: true,
    erc20Contracts: null,
    hooks: setupHooks({ isLoading: true } as any),
  };
};

export const createWeb3State = ({
  web3,
  setWeb3,
  nftFractionsFactory,
  nftFractionsVendor,
  nftFractionToken,
  provider,
  ccNft,
  nftVendor,
  erc20Contracts,
  nftOffers,
  isLoading,
}: Web3Dependencies) => {
  return {
    web3,
    setWeb3,
    provider,
    ccNft,
    nftVendor,
    isLoading,
    nftOffers,
    nftFractionToken,
    nftFractionsVendor,
    nftFractionsFactory,
    erc20Contracts,
    hooks: setupHooks({
      web3,
      setWeb3,
      provider,
      nftFractionToken,
      nftFractionsFactory,
      nftFractionsVendor,
      ccNft,
      nftVendor,
      nftOffers,
      isLoading,
      erc20Contracts,
    }),
  };
};

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContractByABI = async (
  web3: any,
  address: string,
  abi: any
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const contract = web3.eth.Contract(abi, address);

  return contract;
};

export const loadContractByAddress = async (
  name: string,
  web3: any,
  address: string
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await import(`contracts/build/contracts/${name}.json`);
  const Artifact = await res.json();

  if (address) {
    const contract = new web3.eth.Contract(Artifact.abi, address);
    return contract;
  } else {
    return Promise.reject(`Contract ${name} cannot be loaded`);
  }
};

export const loadContract = async (
  name: string,
  web3: any
): Promise<Contract | null> => {
  if (!web3) return null;

  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await import(`contracts/build/contracts/${name}.json`);
  const Artifact = res;

  // if (!web3) {
  //   return Promise.reject('Web3 is not defined!')
  // }

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new web3.eth.Contract(
      Artifact.abi,
      Artifact.networks[NETWORK_ID].address as string
    );

    return contract;
  } else {
    return Promise.reject(`Contract ${name} cannot be loaded`);
  }
};
