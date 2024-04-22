/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";

import { Request, Response } from "express";
import * as admin from "firebase-admin";
import cors from "cors";

import { log } from "console";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const onSaleStateUpdate = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { tokenId, state } = req.body;

        log("TokenId:", tokenId);
        log("State:", state);

        await admin.firestore().collection("casks").doc(tokenId).set(
          {
            active: state,
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
  }
);
