/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ethers } from "ethers";

import axios from "axios";
import cors from "cors";
import {
  CCNFT_CONTRACT_ADDRESS,
  NFT_VENDOR_CONTRACT_ADDRESS,
  PINATA_GATEWAY_TOKEN,
  PINATA_GATEWAY_URL,
  PRIVATE_KEY,
  REGION,
} from "../../constants";
import { getContract } from "../../web3";

import CCNFTABI from "../../contracts/CCNft.json";
import NFTVENDORABI from "../../contracts/NFTVendor.json";

import { BLOCKCHAIH_URL } from "../../constants";
import { ALLOWED_FIELDS } from "../../utils/utils";
import { log } from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

log("URL de la blockchain:", BLOCKCHAIH_URL);
log("Private key:", PRIVATE_KEY);

const provider = new ethers.JsonRpcProvider(BLOCKCHAIH_URL as string);
const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider);

export const createNft = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { ipfsHash, nftURI, price } = req.body;

        const nftRes = await axios.get(
          `${PINATA_GATEWAY_URL}/${ipfsHash}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`
        );
        const content = nftRes.data;
        log("Contenido de la NFT:", content);

        Object.keys(content).forEach((key) => {
          if (!ALLOWED_FIELDS.includes(key)) {
            throw new Error("Invalid Json structure");
          }
        });

        const ccNft = getContract(
          CCNFT_CONTRACT_ADDRESS as string,
          CCNFTABI.abi,
          wallet
        );

        const nftVendor = getContract(
          NFT_VENDOR_CONTRACT_ADDRESS as string,
          NFTVENDORABI.abi,
          wallet
        );

        const gasEstimateMint = await ccNft.mintNFT.estimateGas(nftURI);

        log("Gas estimate mint:", BigInt(gasEstimateMint));

        let tx = await ccNft.mintNFT(nftURI, {
          gasLimit: BigInt(gasEstimateMint) + BigInt(1000),
        });
        const receipt = await tx.wait();

        const tokenId = parseInt(receipt.logs[0].topics[3]);

        log("Token ID:", tokenId);

        const gasEstimateApprove = await ccNft.approve.estimateGas(
          NFT_VENDOR_CONTRACT_ADDRESS,
          tokenId
        );

        tx = await ccNft.approve(NFT_VENDOR_CONTRACT_ADDRESS, tokenId, {
          gasLimit: BigInt(gasEstimateApprove) + BigInt(1000),
        });
        await tx.wait();

        const gastEstimateList = await nftVendor.listItem.estimateGas(
          tokenId,
          ethers.parseUnits(price.toString(), "ether"),
          false
        );

        tx = await nftVendor.listItem(
          tokenId,
          ethers.parseUnits(price.toString(), "ether"),
          false,
          {
            gasLimit: BigInt(gastEstimateList) + BigInt(1000),
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
