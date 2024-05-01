import { Request, Response } from "express";

import * as functions from "firebase-functions";
import Web3 from "web3";
import { BLOCKCHAIH_URL, REGION } from "../constants";
import * as admin from "firebase-admin";
import cors from "cors";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

// Usa la URL de Ngrok para conectar con la blockchain local
const web3 = new Web3(BLOCKCHAIH_URL as string);

export const checkBlockchainConnection = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      web3.eth
        .getAccounts()
        .then((accounts) => {
          res.send("Cuentas: " + accounts.join(", "));
          return;
        })
        .catch((error) => {
          console.error("Error al acceder a la blockchain:", error);
          res.status(500).send("Error al conectar con la blockchain");
        });
    });
  });
