/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import cors from "cors";
import { log } from "firebase-functions/logger";
import { REGION } from "../../constants";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

export const getNfts = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      // const pageSize = parseInt(req.query.pageSize as string) || 10;
      // const lastDocId = req.query.lastDocId;
      // const filters = JSON.parse((req.query.filters as string) || "{}");
      // const sortBy = req.query.sortBy as string;

      const { startAfter, limit, orderBy, filters }: any = req.query;
      let nextCursor = null;

      log("startAfter: ", startAfter);
      log("filters", filters);

      let query = admin.firestore().collection("casks") as any;

      if (orderBy) {
        if (orderBy === "age") {
          query = query.orderBy("attributes.age");
        } else {
          query = query.orderBy(orderBy);
        }
      }

      if (filters?.active) {
        query = query.where("active", "==", filters.active);
      }

      if (filters?.name) {
        query = query
          .where("name", ">=", filters.name)
          .where("name", "<=", filters.name + "\uf8ff");
      }

      log("query: ", query);

      if (startAfter) {
        const docSnapshot = await admin
          .firestore()
          .doc(`casks/${startAfter}`)
          .get();
        if (docSnapshot.exists) {
          query = query.startAfter(docSnapshot);
        }
      }

      if (limit) {
        query = query.limit(parseInt(limit, 10));
      }

      try {
        const snapshot = await query.get();
        const result: any = [];
        snapshot.forEach((doc: any) => {
          result.push({ id: doc.id, ...doc.data() });
        });
        if (!snapshot.empty && snapshot.docs.length === parseInt(limit, 10)) {
          nextCursor = snapshot.docs[snapshot.docs.length - 1].id;
        }
        res.json({ result, nextCursor });
      } catch (error: any) {
        res.status(500).send(error.toString());
      }
    });
  });
