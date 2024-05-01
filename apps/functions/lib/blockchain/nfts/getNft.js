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
exports.getNft = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("firebase-functions/logger");
const constants_1 = require("../../constants");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const corsHandler = (0, cors_1.default)({ origin: true });
exports.getNft = functions
    .region(constants_1.REGION)
    .https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        var _a, _b;
        const tokenId = req.query.tokenId;
        try {
            const query = admin.firestore().collection("casks").doc(tokenId).get();
            const result = await query;
            if (!result.exists) {
                return res.status(404).send("Document not found.");
            }
            const data = result.data();
            (0, logger_1.log)("Owner", (_a = data === null || data === void 0 ? void 0 : data.owner) === null || _a === void 0 ? void 0 : _a.address);
            const userQuery = admin
                .firestore()
                .collection("users")
                .doc(data === null || data === void 0 ? void 0 : data.owner.address.toLowerCase())
                .get();
            const userResult = await userQuery;
            if (!userResult.exists) {
                return res.status(404).send("User not found.");
            }
            const user = userResult.data();
            const cask = {
                active: data === null || data === void 0 ? void 0 : data.active,
                tokenId: result === null || result === void 0 ? void 0 : result.id,
                tokenURI: data === null || data === void 0 ? void 0 : data.pinata,
                creator: data === null || data === void 0 ? void 0 : data.creator,
                owner: {
                    address: (_b = data === null || data === void 0 ? void 0 : data.owner) === null || _b === void 0 ? void 0 : _b.address,
                    nickname: (user === null || user === void 0 ? void 0 : user.nickname) || "",
                },
                price: data === null || data === void 0 ? void 0 : data.price,
                bestBarrel: data === null || data === void 0 ? void 0 : data.bestBarrel,
                meta: {
                    name: data === null || data === void 0 ? void 0 : data.name,
                    description: data === null || data === void 0 ? void 0 : data.description,
                    image: data === null || data === void 0 ? void 0 : data.image,
                    attributes: data === null || data === void 0 ? void 0 : data.attributes,
                },
            };
            res.status(200).json({
                cask,
                error: null,
            });
        }
        catch (error) {
            (0, logger_1.log)("Error getting documents: ", error);
            res.status(500).send("Error fetching documents.");
        }
    });
});
