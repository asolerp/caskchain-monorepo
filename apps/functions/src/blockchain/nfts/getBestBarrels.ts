/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import cors from "cors";
import { REGION } from "../../constants";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const getBestBarrels = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      const query = admin
        .firestore()
        .collection("casks")
        .where("bestBarrel", "==", true) as any;

      try {
        const snapshot = await query.get();
        const result: any = [];
        snapshot.forEach((doc: any) => {
          result.push({ id: doc.id, ...doc.data() });
        });
        res.json({ result });
      } catch (error: any) {
        res.status(500).send(error.toString());
      }
    });
  });
