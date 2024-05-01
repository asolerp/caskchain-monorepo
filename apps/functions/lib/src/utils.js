"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeId = exports.isValidEthAddress = void 0;
const web3_1 = __importDefault(require("web3"));
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
//# sourceMappingURL=utils.js.map