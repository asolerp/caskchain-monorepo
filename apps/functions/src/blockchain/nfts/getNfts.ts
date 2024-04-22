/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import cors from "cors";
import { log } from "console";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const getNfts = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const lastDocId = req.query.lastDocId;
      const filters = JSON.parse((req.query.filters as string) || "{}"); // Esperamos que los filtros sean pasados como un JSON string

      log("PageSize: ", pageSize);

      try {
        let query = admin
          .firestore()
          .collection("casks")
          .orderBy("name")
          .limit(pageSize + 1);

        if (lastDocId) {
          const lastDoc = await admin
            .firestore()
            .collection("casks")
            .doc(lastDocId as string)
            .get();
          if (!lastDoc.exists) {
            return res.status(404).send("Last document not found.");
          }
          query = query.startAfter(lastDoc);
        }

        if (filters.name) {
          const endName = filters.name.replace(/.$/, (c: any) =>
            String.fromCharCode(c.charCodeAt(0) + 1)
          );
          query = query
            .where("name", ">=", filters.name)
            .where("name", "<", endName);
        }

        // Object.keys(filters).forEach((key) => {
        //   query = query.where(key, "==", filters[key]);
        // });

        const snapshot = await query.get();
        const results: any = [];
        let nextPageToken = null;

        snapshot.forEach((doc) => {
          log("Doc: ", doc.id, " => ", doc.data());
          if (results.length < pageSize) {
            results.push({ id: doc.id, ...doc.data() });
          } else {
            nextPageToken = doc.id;
          }
        });

        log("Results: ", results);

        res.status(200).json({
          items: results,
          nextPageToken,
          hasMore: nextPageToken !== null,
          error: null,
        });
      } catch (error) {
        console.error("Error getting documents: ", error);
        res.status(500).send("Error fetching documents.");
      }
    });
  }
);
