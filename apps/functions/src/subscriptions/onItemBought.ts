/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";

import { Request, Response } from "express";
import * as admin from "firebase-admin";
import cors from "cors";

import { log } from "console";
import { getUser } from "../helpers/db";
import { REGION } from "../constants";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const onItemBought = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { buyer, seller, tokenId, isErc20, price, transactionHash } =
          req.body;

        log("TokenId:", tokenId);

        const userResult = await getUser(buyer);
        const userData = userResult.data();

        await admin
          .firestore()
          .collection("casks")
          .doc(tokenId)
          .set(
            {
              owner: { address: buyer, nickname: userData?.nickname || "" },
            },
            {
              merge: true,
            }
          );

        await admin.firestore().collection("transactions").add({
          to: buyer,
          from: seller,
          tokenId,
          isErc20,
          price,
          transactionHash,
          timestamp: Date.now(),
        });

        res.json({ error: null });
      } catch (error: any) {
        log("Error:", error.message);
        res.json({ error: error.message });
      }
    });
  });
