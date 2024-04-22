/* eslint-disable @typescript-eslint/no-explicit-any */
import Web3 from "web3";
import { recoverPersonalSignature } from "@metamask/eth-sig-util";
import { log } from "firebase-functions/logger";
import { ethers } from "ethers";

export const ALLOWED_FIELDS = ["name", "description", "image", "attributes"];

export const isValidEthAddress = (address: string) =>
  Web3.utils.isAddress(address);

export const makeId = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isValidSignature = (
  address: string,
  signature: string,
  messageToSign: string
) => {
  if (!address || typeof address !== "string" || !signature || !messageToSign) {
    return false;
  }

  const signingAddress = recoverPersonalSignature({
    data: messageToSign,
    signature,
  });

  return (
    signingAddress && signingAddress.toLowerCase() === address.toLowerCase()
  );
};

export const sendOptimizedTransaction = async (
  tx: any,
  provider: ethers.JsonRpcProvider,
  wallet: any
) => {
  const currentGasPrice: any = (await provider.getFeeData()).gasPrice;
  if (!currentGasPrice) {
    throw new Error("No se pudo obtener el gas price actual");
  }
  const adjustedGasPrice =
    (BigInt(currentGasPrice) * BigInt(110)) / BigInt(100);

  const txResponse = await wallet.sendTransaction({
    ...tx,
    gasPrice: adjustedGasPrice,
  });
  const receipt = await txResponse.wait();
  log("Transacción confirmada con gas price ajustado:", receipt);
  log("Logs", receipt.logs);
  log("Events", receipt.events);
  return receipt;
};
