/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContractAbi } from "web3";
import { ethers } from "ethers";
import { BLOCKCHAIH_URL, PRIVATE_KEY } from "./constants";

export const initWeb3 = () => {
  const provider = new ethers.JsonRpcProvider(BLOCKCHAIH_URL as string);
  const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider);
  return wallet;
};

export const getContract = (
  contractAddress: string,
  ABI: ContractAbi,
  wallet: any
) => {
  const contract = new ethers.Contract(contractAddress, ABI, wallet);
  return contract;
};
