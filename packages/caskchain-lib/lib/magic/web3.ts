import Web3 from "web3";
import { getMagicProvider } from "./provider";

export const getWeb3 = async (magic: any) => {
  const provider = await getMagicProvider(magic);
  return new Web3(provider);
};
