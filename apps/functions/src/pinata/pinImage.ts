/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";
import { Request, Response } from "express";
import * as admin from "firebase-admin";
import cors from "cors";
import { log } from "console";
import { PINATA_API_KEY, REGION } from "../constants";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import FormData from "form-data";

const JWT = `Bearer ${PINATA_API_KEY}`;

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const pinImage = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      try {
        const { bytes, fileName, contentType } = req.body;
        if (!bytes || !fileName || !contentType) {
          res.status(422).send({ message: "Image data are missing" });
          return;
        }

        const byteArray = Object.values(bytes);
        const buffer = Buffer.from(byteArray as number[]);

        const formData = new FormData();
        formData.append("file", buffer, {
          contentType,
          filename: `${fileName}-${uuidv4()}`,
        });

        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              Authorization: JWT,
              ...formData.getHeaders(),
            },
          }
        );

        log("Image pinned to IPFS", response.data);

        res.status(200).send(response.data);
      } catch (e: any) {
        log("Error pinning image to IPFS", e.message);
        res.status(500).send({ message: "Cannot pin image", error: e.message });
      }
    });
  });
