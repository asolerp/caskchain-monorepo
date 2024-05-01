/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";
import { PINATA_GATEWAY_TOKEN, PINATA_GATEWAY_URL, REGION } from "../constants";
import { Request, Response } from "express";
import * as admin from "firebase-admin";
import cors from "cors";

import axios from "axios";
import { log } from "console";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const onNewMint = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { owner, tokenId, tokenUri } = req.body;

        log("Owner:", owner);
        log("TokenId:", tokenId);
        log("TokenUri:", tokenUri);

        const ipfsHash = tokenUri.split("/ipfs/")[1];
        const pinataURL = `${PINATA_GATEWAY_URL}/${ipfsHash}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
        const metaResponse = await axios.get(pinataURL);
        const meta: any = await metaResponse.data;

        log("Meta:", meta);

        await admin
          .firestore()
          .collection("casks")
          .doc(tokenId)
          .set(
            {
              tokenId,
              name: meta.name,
              pinata: tokenUri,
              creator: owner,
              description: meta.description,
              image: meta.image,
              active: false,
              owner: {
                address: owner,
              },
              attributes: meta.attributes.reduce((acc: any, attribute: any) => {
                acc[attribute.trait_type] = attribute.value;
                return acc;
              }, {}),
              favorites: 0,
            },
            {
              merge: true,
            }
          );

        res.json({ error: null });
      } catch (error: any) {
        log("Error:", error.message);
        res.json({ error: error.message });
      }
    });
  });
