/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import cors from "cors";
import { NFT_VENDOR_CONTRACT_ADDRESS } from "../../constants";
import { getContract, initWeb3 } from "../../web3";

import NFTVENDORABI from "../../contracts/NFTVendor.json";

import { log } from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

const wallet = initWeb3();

export const updateSaleState = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { tokenId, state } = req.body;

        log("TokenId:", tokenId);
        log("State:", state);

        const nftVendor = getContract(
          NFT_VENDOR_CONTRACT_ADDRESS as string,
          NFTVENDORABI.abi,
          wallet
        );

        const gasEstimateUpdateState =
          await nftVendor.updateStateForSale.estimateGas(tokenId, state);

        log("Gas estimate updateState:", BigInt(gasEstimateUpdateState));

        const tx = await nftVendor.updateStateForSale(tokenId, state, {
          gasLimit: BigInt(gasEstimateUpdateState) + BigInt(1000),
        });
        await tx.wait();

        res.status(200).json({ error: null });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server_error" });
      }
    });
  }
);
