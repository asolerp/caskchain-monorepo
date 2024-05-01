import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import { REGION } from "../constants";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const getUserData = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { uid } = req.query;

        if (!uid) {
          res.status(400).json({ error: "uid_required" }); // 400 Bad Request
          return;
        }

        const userRef = admin
          .firestore()
          .collection("users")
          .doc(uid as string);

        const user = await userRef.get();

        res.json({ user: user.data(), error: null });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server_error" });
      }
    });
  });
