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
exports.verifyUser = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("../constants");
const web3_1 = require("../web3");
const CCNft_json_1 = __importDefault(require("../contracts/CCNft.json"));
const console_1 = require("console");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const wallet = (0, web3_1.initWeb3)();
const corsHandler = (0, cors_1.default)({ origin: true });
exports.verifyUser = functions
    .region(constants_1.REGION)
    .https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        var _a;
        const adminAccess = req.query.admin === "true";
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1];
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        const ccNft = (0, web3_1.getContract)(constants_1.CCNFT_CONTRACT_ADDRESS, CCNft_json_1.default.abi, wallet);
        admin
            .auth()
            .verifyIdToken(token)
            .then(async (decodedToken) => {
            const uid = decodedToken.uid;
            if (adminAccess) {
                const contractOwner = await ccNft.owner();
                (0, console_1.log)("contractOwner", contractOwner);
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
