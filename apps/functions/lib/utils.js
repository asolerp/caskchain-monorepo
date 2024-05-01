"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOptimizedTransaction = exports.isValidSignature = exports.makeId = exports.isValidEthAddress = exports.ALLOWED_FIELDS = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const web3_1 = __importDefault(require("web3"));
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const logger_1 = require("firebase-functions/logger");
exports.ALLOWED_FIELDS = ["name", "description", "image", "attributes"];
const isValidEthAddress = (address) => web3_1.default.utils.isAddress(address);
exports.isValidEthAddress = isValidEthAddress;
const makeId = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.makeId = makeId;
const isValidSignature = (address, signature, messageToSign) => {
    if (!address || typeof address !== "string" || !signature || !messageToSign) {
        return false;
    }
    const signingAddress = (0, eth_sig_util_1.recoverPersonalSignature)({
        data: messageToSign,
        signature,
    });
    return (signingAddress && signingAddress.toLowerCase() === address.toLowerCase());
};
exports.isValidSignature = isValidSignature;
const sendOptimizedTransaction = async (tx, provider, wallet) => {
    const currentGasPrice = (await provider.getFeeData()).gasPrice;
    if (!currentGasPrice) {
        throw new Error("No se pudo obtener el gas price actual");
    }
    const adjustedGasPrice = (BigInt(currentGasPrice) * BigInt(110)) / BigInt(100);
    const txResponse = await wallet.sendTransaction({
        ...tx,
        gasPrice: adjustedGasPrice,
    });
    const receipt = await txResponse.wait();
    (0, logger_1.log)("Transacción confirmada con gas price ajustado:", receipt);
    (0, logger_1.log)("Logs", receipt.logs);
    (0, logger_1.log)("Events", receipt.events);
    return receipt;
};
exports.sendOptimizedTransaction = sendOptimizedTransaction;
