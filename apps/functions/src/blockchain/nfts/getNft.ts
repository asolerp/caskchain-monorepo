/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import cors from "cors";
import { log } from "firebase-functions/logger";
import { REGION } from "../../constants";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const getNft = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      const tokenId = req.query.tokenId as string;

      try {
        const query = admin.firestore().collection("casks").doc(tokenId).get();
        const result = await query;

        if (!result.exists) {
          return res.status(404).send("Document not found.");
        }

        const data = result.data();

        log("Owner", data?.owner?.address);

        const userQuery = admin
          .firestore()
          .collection("users")
          .doc(data?.owner.address.toLowerCase())
          .get();
        const userResult = await userQuery;

        if (!userResult.exists) {
          return res.status(404).send("User not found.");
        }

        const user = userResult.data();

        const cask = {
          active: data?.active,
          tokenId: result?.id,
          tokenURI: data?.pinata,
          creator: data?.creator,
          owner: {
            address: data?.owner?.address,
            nickname: user?.nickname || "",
          },
          price: data?.price,
          bestBarrel: data?.bestBarrel,
          meta: {
            name: data?.name,
            description: data?.description,
            image: data?.image,
            attributes: data?.attributes,
          },
        };

        res.status(200).json({
          cask,
          error: null,
        });
      } catch (error) {
        log("Error getting documents: ", error);
        res.status(500).send("Error fetching documents.");
      }
    });
  });
