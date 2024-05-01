/* eslint-disable @typescript-eslint/no-explicit-any */
import Web3 from "web3";
import { recoverPersonalSignature } from "@metamask/eth-sig-util";
import { log } from "firebase-functions/logger";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";

export const ALLOWED_FIELDS = ["name", "description", "image", "attributes"];

export const isValidEthAddress = (address: string) =>
  Web3.utils.isAddress(address);

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

export const generateNonce = () => {
  const uuid = uuidv4();

  const nonce: string | Buffer =
    "\x19Welcome to CaskChain Marketplace, the premium destination for trading and purchasing rare and unique casks.\n\n" +
    `\x19Nonce: ${uuid}\n` +
    `\x19IMPORTANT: This nonce ${uuid} is unique to this message and should only be used once. Please do not share this message or nonce with anyone else to maintain the security and integrity of your transaction.\n\n` +
    "\x19Please proceed to CaskChain Marketplace to begin your transactions.\n\n" +
    "\x19Thank you\n" +
    "\x19CaskChain Team\n";
  return nonce;
};
