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
exports.checkBlockchainConnection = void 0;
const functions = __importStar(require("firebase-functions"));
const web3_1 = __importDefault(require("web3"));
const constants_1 = require("../constants");
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const corsHandler = (0, cors_1.default)({ origin: true });
// Usa la URL de Ngrok para conectar con la blockchain local
const web3 = new web3_1.default(constants_1.BLOCKCHAIH_URL);
exports.checkBlockchainConnection = functions
    .region(constants_1.REGION)
    .https.onRequest(async (req, res) => {
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
