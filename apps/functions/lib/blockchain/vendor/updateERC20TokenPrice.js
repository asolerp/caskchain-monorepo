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
exports.updateERC20TokenPrice = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("../../constants");
const web3_1 = require("../../web3");
const NFTVendor_json_1 = __importDefault(require("../../contracts/NFTVendor.json"));
const logger_1 = require("firebase-functions/logger");
const ethers_1 = require("ethers");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const corsHandler = (0, cors_1.default)({ origin: true });
const wallet = (0, web3_1.initWeb3)();
exports.updateERC20TokenPrice = functions
    .region(constants_1.REGION)
    .https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { tokenId, erc20ListPrice } = req.body;
            (0, logger_1.log)("TokenId:", tokenId);
            (0, logger_1.log)("ERC20ListPrice:", ethers_1.ethers.parseUnits(erc20ListPrice.toString(), "ether"));
            const nftVendor = (0, web3_1.getContract)(constants_1.NFT_VENDOR_CONTRACT_ADDRESS, NFTVendor_json_1.default.abi, wallet);
            const gasEstimateUpdateERC20Price = await nftVendor.updateERC20TokenPrice.estimateGas(tokenId, constants_1.NEXT_PUBILC_USDT_CONTRACT_ADDRESS, ethers_1.ethers.parseUnits(erc20ListPrice.toString(), "ether"));
            (0, logger_1.log)("Gas estimate updateState:", BigInt(gasEstimateUpdateERC20Price));
            const tx = await nftVendor.updateERC20TokenPrice(tokenId, constants_1.NEXT_PUBILC_USDT_CONTRACT_ADDRESS, ethers_1.ethers.parseUnits(erc20ListPrice.toString(), "ether"), {
                gasLimit: BigInt(gasEstimateUpdateERC20Price) + BigInt(1000),
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
