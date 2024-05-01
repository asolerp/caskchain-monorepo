// try {

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";

import { Request, Response } from "express";
import * as admin from "firebase-admin";
import cors from "cors";

import { log } from "console";

import { PINATA_API_KEY, REGION } from "../constants";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const JWT = `Bearer ${PINATA_API_KEY}`;

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const pinMetadata = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { body } = req;
        const nft = body.nft;

        if (!nft.name || !nft.description || !nft.attributes) {
          return res
            .status(422)
            .send({ message: "Some of the form data are missing" });
        }

        const jsonRes = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          {
            pinataMetadata: {
              name: uuidv4(),
            },
            pinataContent: nft,
          },
          {
            headers: {
              Authorization: JWT,
            },
          }
        );

        return res.status(200).send(jsonRes.data);
      } catch (e: any) {
        log("Error pining metadata to IPFS", e.message, {
          metadata: {
            service: "nfts-router",
          },
        });
        return res.status(422).send({ message: "Cannot create JSON" });
      }
    });
  });
