import { isValidEthAddress, makeId } from "../utils/utils";
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import { log } from "firebase-functions/logger";

admin.initializeApp();

const corsHandler = cors({ origin: true });

export const getMessage = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { address } = req.query;

        log("address", address);

        if (!address) {
          res.status(400).json({ error: "address_required" }); // 400 Bad Request
          return;
        }

        if (!isValidEthAddress(address as string)) {
          res.status(400).json({ error: "invalid_address" }); // 400 Bad Request
          return;
        }

        const randomString = makeId(20);
        let messageToSign = `Wallet address: ${address} Nonce: ${randomString}`;
        const userRef = admin
          .firestore()
          .collection("users")
          .doc(address as string);
        const user = await userRef.get();

        if (user.exists) {
          const userData = user.data();
          if (userData && userData.messageToSign) {
            messageToSign = userData.messageToSign;
          } else {
            await userRef.set({ messageToSign }, { merge: true });
          }
        } else {
          await userRef.set({ messageToSign }, { merge: true });
        }

        log("messageToSign", messageToSign);

        res.json({ messageToSign, error: null });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server_error" });
      }
    });
  }
);
