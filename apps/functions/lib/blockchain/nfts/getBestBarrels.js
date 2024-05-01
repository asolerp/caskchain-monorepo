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
exports.getBestBarrels = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("../../constants");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const corsHandler = (0, cors_1.default)({ origin: true });
exports.getBestBarrels = functions
    .region(constants_1.REGION)
    .https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        const query = admin
            .firestore()
            .collection("casks")
            .where("bestBarrel", "==", true);
        try {
            const snapshot = await query.get();
            const result = [];
            snapshot.forEach((doc) => {
                result.push({ id: doc.id, ...doc.data() });
            });
            res.json({ result });
        }
        catch (error) {
            res.status(500).send(error.toString());
        }
    });
});
