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
exports.createNft = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("../constants");
const web3_1 = require("../web3");
const CCNft_json_1 = __importDefault(require("../contracts/CCNft.json"));
const NFTVendor_json_1 = __importDefault(require("../contracts/NFTVendor.json"));
const constants_2 = require("../constants");
const utils_1 = require("../utils");
const logger_1 = require("firebase-functions/logger");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const corsHandler = (0, cors_1.default)({ origin: true });
(0, logger_1.log)("URL de la blockchain:", constants_2.BLOCKCHAIH_URL);
(0, logger_1.log)("Private key:", constants_1.PRIVATE_KEY);
const provider = new ethers_1.ethers.JsonRpcProvider(constants_2.BLOCKCHAIH_URL);
const wallet = new ethers_1.ethers.Wallet(constants_1.PRIVATE_KEY, provider);
exports.createNft = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { ipfsHash, nftURI, price } = req.body;
            const nftRes = await axios_1.default.get(`${constants_1.PINATA_GATEWAY_URL}/${ipfsHash}?pinataGatewayToken=${constants_1.PINATA_GATEWAY_TOKEN}`);
            const content = nftRes.data;
            (0, logger_1.log)("Contenido de la NFT:", content);
            Object.keys(content).forEach((key) => {
                if (!utils_1.ALLOWED_FIELDS.includes(key)) {
                    throw new Error("Invalid Json structure");
                }
            });
            const ccNft = (0, web3_1.getContract)(constants_1.CCNFT_CONTRACT_ADDRESS, CCNft_json_1.default.abi, wallet);
            const nftVendor = (0, web3_1.getContract)(constants_1.NFT_VENDOR_CONTRACT_ADDRESS, NFTVendor_json_1.default.abi, wallet);
            const gasEstimateMint = await ccNft.mintNFT.estimateGas(nftURI);
            (0, logger_1.log)("Gas estimate mint:", BigInt(gasEstimateMint));
            let tx = await ccNft.mintNFT(nftURI, {
                gasLimit: BigInt(gasEstimateMint) + BigInt(1000),
            });
            const receipt = await tx.wait();
            const tokenId = parseInt(receipt.logs[0].topics[3]);
            (0, logger_1.log)("Token ID:", tokenId);
            const gasEstimateApprove = await ccNft.approve.estimateGas(constants_1.NFT_VENDOR_CONTRACT_ADDRESS, tokenId);
            tx = await ccNft.approve(constants_1.NFT_VENDOR_CONTRACT_ADDRESS, tokenId, {
                gasLimit: BigInt(gasEstimateApprove) + BigInt(1000),
            });
            await tx.wait();
            const gastEstimateList = await nftVendor.listItem.estimateGas(tokenId, ethers_1.ethers.parseUnits(price.toString(), "ether"), false);
            tx = await nftVendor.listItem(tokenId, ethers_1.ethers.parseUnits(price.toString(), "ether"), false, {
                gasLimit: BigInt(gastEstimateList) + BigInt(1000),
            });
            await tx.wait();
            res.status(200).json({ error: null });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "server_error" });
        }
    });
});
