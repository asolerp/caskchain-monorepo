/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import cors from "cors";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const updateBestBarrel = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { tokenId, state } = req.body;

        await admin.firestore().collection("casks").doc(tokenId).set(
          {
            offer: state,
          },
          {
            merge: true,
          }
        );

        res.status(200).json({ error: null });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server_error" });
      }
    });
  }
);
