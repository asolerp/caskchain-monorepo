import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import { CCNFT_CONTRACT_ADDRESS, REGION } from "../constants";
import { getContract, initWeb3 } from "../web3";
import CCNFTABI from "../contracts/CCNft.json";
import { log } from "console";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const wallet = initWeb3();
const corsHandler = cors({ origin: true });

export const verifyUser = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      const adminAccess = req.query.admin === "true";
      const token = req.headers.authorization?.split("Bearer ")[1];

      if (!token) {
        return res.status(401).send("Unauthorized");
      }

      const ccNft = getContract(
        CCNFT_CONTRACT_ADDRESS as string,
        CCNFTABI.abi,
        wallet
      );

      admin
        .auth()
        .verifyIdToken(token)
        .then(async (decodedToken) => {
          const uid = decodedToken.uid;

          if (adminAccess) {
            const contractOwner = await ccNft.owner();
            log("contractOwner", contractOwner);
            if (contractOwner.toLowerCase() !== uid.toLowerCase()) {
              return res.status(403).send("Unauthorized");
            }
          }

          // Enviar una respuesta positiva si el token es válido
          res.send({ uid: uid, status: "authenticated" });
        })
        .catch((error) => {
          console.error("Error while verifying Firebase ID token:", error);
          res.status(403).send("Unauthorized");
        });
    });
  });
