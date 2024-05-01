"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNfts = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("firebase-functions/logger");
const constants_1 = require("../../constants");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const corsHandler = (0, cors_1.default)({ origin: true });
exports.getNfts = functions
    .region(constants_1.REGION)
    .https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        // const pageSize = parseInt(req.query.pageSize as string) || 10;
        // const lastDocId = req.query.lastDocId;
        // const filters = JSON.parse((req.query.filters as string) || "{}");
        // const sortBy = req.query.sortBy as string;
        const { startAfter, limit, orderBy, filters } = req.query;
        let nextCursor = null;
        (0, logger_1.log)("startAfter: ", startAfter);
        (0, logger_1.log)("filters", filters);
        let query = admin.firestore().collection("casks");
        if (orderBy) {
            if (orderBy === "age") {
                query = query.orderBy("attributes.age");
            }
            else {
                query = query.orderBy(orderBy);
            }
        }
        if (filters === null || filters === void 0 ? void 0 : filters.active) {
            query = query.where("active", "==", filters.active);
        }
        if (filters === null || filters === void 0 ? void 0 : filters.name) {
            query = query
                .where("name", ">=", filters.name)
                .where("name", "<=", filters.name + "\uf8ff");
        }
        (0, logger_1.log)("query: ", query);
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
            const result = [];
            snapshot.forEach((doc) => {
                result.push({ id: doc.id, ...doc.data() });
            });
            if (!snapshot.empty && snapshot.docs.length === parseInt(limit, 10)) {
                nextCursor = snapshot.docs[snapshot.docs.length - 1].id;
            }
            res.json({ result, nextCursor });
        }
        catch (error) {
            res.status(500).send(error.toString());
        }
    });
});
