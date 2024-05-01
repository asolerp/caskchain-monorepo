/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import cors from "cors";
import {
  NEXT_PUBILC_USDT_CONTRACT_ADDRESS,
  NFT_VENDOR_CONTRACT_ADDRESS,
  REGION,
} from "../../constants";
import { getContract, initWeb3 } from "../../web3";

import NFTVENDORABI from "../../contracts/NFTVendor.json";

import { log } from "firebase-functions/logger";
import { ethers } from "ethers";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

const wallet = initWeb3();

export const updateERC20TokenPrice = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { tokenId, erc20ListPrice } = req.body;

        log("TokenId:", tokenId);
        log(
          "ERC20ListPrice:",
          ethers.parseUnits(erc20ListPrice.toString(), "ether")
        );

        const nftVendor = getContract(
          NFT_VENDOR_CONTRACT_ADDRESS as string,
          NFTVENDORABI.abi,
          wallet
        );

        const gasEstimateUpdateERC20Price =
          await nftVendor.updateERC20TokenPrice.estimateGas(
            tokenId,
            NEXT_PUBILC_USDT_CONTRACT_ADDRESS,
            ethers.parseUnits(erc20ListPrice.toString(), "ether")
          );

        log("Gas estimate updateState:", BigInt(gasEstimateUpdateERC20Price));

        const tx = await nftVendor.updateERC20TokenPrice(
          tokenId,
          NEXT_PUBILC_USDT_CONTRACT_ADDRESS,
          ethers.parseUnits(erc20ListPrice.toString(), "ether"),
          {
            gasLimit: BigInt(gasEstimateUpdateERC20Price) + BigInt(1000),
          }
        );
        await tx.wait();

        res.status(200).json({ error: null });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server_error" });
      }
    });
  });
