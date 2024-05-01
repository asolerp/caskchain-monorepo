"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContract = exports.initWeb3 = void 0;
const ethers_1 = require("ethers");
const constants_1 = require("./constants");
const initWeb3 = () => {
    const provider = new ethers_1.ethers.JsonRpcProvider(constants_1.BLOCKCHAIH_URL);
    const wallet = new ethers_1.ethers.Wallet(constants_1.PRIVATE_KEY, provider);
    return wallet;
};
exports.initWeb3 = initWeb3;
const getContract = (contractAddress, ABI, wallet) => {
    const contract = new ethers_1.ethers.Contract(contractAddress, ABI, wallet);
    return contract;
};
exports.getContract = getContract;
