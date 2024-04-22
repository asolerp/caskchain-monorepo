import { isValidEthAddress, isValidSignature } from "../utils/utils";
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";

// Asegúrate de inicializar la aplicación admin de Firebase una sola vez
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const getJWT = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { address, signature } = req.query;

        if (!isValidEthAddress(address as string) || !signature) {
          res.status(400).send({ error: "invalid_parameters" });
          return;
        }

        const [customToken, doc] = await Promise.all([
          admin.auth().createCustomToken(address as string),
          admin
            .firestore()
            .collection("users")
            .doc(address as string)
            .get(),
        ]);

        if (!doc.exists) {
          res.status(400).send({ error: "invalid_message_to_sign" });
          return;
        }

        const docData = doc.data();

        if (!docData) {
          res.status(400).send({ error: "invalid_message_to_sign" });
          return;
        }

        const messageToSign = docData.messageToSign;

        if (!messageToSign) {
          res.status(400).json({ error: "invalid_message_to_sign" });
          return;
        }

        const validSignature = isValidSignature(
          address as string,
          signature as string,
          messageToSign
        );

        if (!validSignature) {
          res.status(400).json({ error: "invalid_signature" });
          return;
        }

        // Delete messageToSign as it can only be used once
        await admin
          .firestore()
          .collection("users")
          .doc(address as string)
          .set(
            {
              messageToSign: null,
            },
            { merge: true }
          );

        res.json({ customToken, error: null });
      } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "server_error" });
      }
    });
  }
);
