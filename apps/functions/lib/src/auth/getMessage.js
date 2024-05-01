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
exports.getMessage = void 0;
const utils_1 = require("../utils");
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
admin.initializeApp();
const corsHandler = (0, cors_1.default)({ origin: true });
exports.getMessage = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { address } = req.query;
            if (!address) {
                res.json({ error: "address_required" });
                return;
            }
            if (!(0, utils_1.isValidEthAddress)(address)) {
                res.json({ error: "invalid_address" });
                return;
            }
            const randomString = (0, utils_1.makeId)(20);
            let messageToSign = `Wallet address: ${address} Nonce: ${randomString}`;
            const userRef = admin
                .firestore()
                .collection("users")
                .doc(address);
            const user = await userRef.get();
            if (user.exists) {
                const userData = user.data();
                if (userData && userData.messageToSign) {
                    messageToSign = userData.messageToSign;
                }
            }
            else {
                await userRef.set({ messageToSign }, { merge: true });
            }
            res.json({ messageToSign, error: null });
        }
        catch (error) {
            console.error(error);
            res.json({ error: "server_error" });
        }
    });
});
//# sourceMappingURL=getMessage.js.map