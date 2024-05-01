"use strict";
// try {
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
exports.pinMetadata = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const console_1 = require("console");
const constants_1 = require("../constants");
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const JWT = `Bearer ${constants_1.PINATA_API_KEY}`;
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const corsHandler = (0, cors_1.default)({ origin: true });
exports.pinMetadata = functions
    .region(constants_1.REGION)
    .https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { body } = req;
            const nft = body.nft;
            if (!nft.name || !nft.description || !nft.attributes) {
                return res
                    .status(422)
                    .send({ message: "Some of the form data are missing" });
            }
            const jsonRes = await axios_1.default.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                pinataMetadata: {
                    name: (0, uuid_1.v4)(),
                },
                pinataContent: nft,
            }, {
                headers: {
                    Authorization: JWT,
                },
            });
            return res.status(200).send(jsonRes.data);
        }
        catch (e) {
            (0, console_1.log)("Error pining metadata to IPFS", e.message, {
                metadata: {
                    service: "nfts-router",
                },
            });
            return res.status(422).send({ message: "Cannot create JSON" });
        }
    });
});
