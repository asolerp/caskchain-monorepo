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
exports.getOwnedNfts = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("firebase-functions/logger");
const web3_1 = require("../../web3");
const constants_1 = require("../../constants");
const CCNft_json_1 = __importDefault(require("../../contracts/CCNft.json"));
// import NFTVENDORABI from "../../contracts/NFTVendor.json";
const authHelper_1 = require("../../utils/authHelper");
const ethers_1 = require("ethers");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const corsHandler = (0, cors_1.default)({ origin: true });
const provider = new ethers_1.ethers.JsonRpcProvider(constants_1.BLOCKCHAIH_URL);
exports.getOwnedNfts = functions
    .region(constants_1.REGION)
    .https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        if (!req.headers.authorization ||
            !req.headers.authorization.startsWith("Bearer ")) {
            res.status(403).send("Unauthorized");
            return;
        }
        const idToken = req.headers.authorization.split("Bearer ")[1];
        try {
            const decodedToken = await (0, authHelper_1.verifyAuthToken)(idToken);
            const uid = decodedToken.uid;
            const ccNft = (0, web3_1.getContract)(constants_1.CCNFT_CONTRACT_ADDRESS, CCNft_json_1.default.abi, provider);
            // const nftVendor = getContract(
            //   NFT_VENDOR_CONTRACT_ADDRESS as string,
            //   NFTVENDORABI.abi,
            //   provider
            // );
            const listNfts = await ccNft.getOwnedNfts({
                from: uid,
            });
            const nfts = await Promise.all(listNfts.map(async (nft) => {
                const nftId = nft[0].toString();
                const nftResponse = await admin
                    .firestore()
                    .collection("casks")
                    .doc(nftId)
                    .get();
                const nftData = nftResponse.data();
                return {
                    tokenId: nftId,
                    creator: nftData === null || nftData === void 0 ? void 0 : nftData.creator,
                    owner: nftData === null || nftData === void 0 ? void 0 : nftData.owner,
                    price: nftData === null || nftData === void 0 ? void 0 : nftData.price,
                    meta: {
                        name: nftData === null || nftData === void 0 ? void 0 : nftData.name,
                        description: nftData === null || nftData === void 0 ? void 0 : nftData.description,
                        image: nftData === null || nftData === void 0 ? void 0 : nftData.image,
                        attributes: nftData === null || nftData === void 0 ? void 0 : nftData.attributes,
                    },
                };
            }));
            res.status(200).json({
                nfts,
                error: null,
            });
        }
        catch (error) {
            (0, logger_1.log)("Error getting documents: ", error);
            res.status(500).send("Error fetching documents.");
        }
    });
});
// public async getOwnedNfts(account: string) {
//     try {
//       const client = this.client()
//       const CCNft = this.contracts()['CCNft']
//       const NftVendor = this.contracts()['NftVendor']
//       const NftOffers = this.contracts()['NftOffers']
//       const NftFractionsFactory = this.contracts()['NftFractionsFactory']
//       const NftFractionsVendor = this.contracts()['NftFractionsVendor']
//       const clientDB = MongoClientFactory.createClient(
//         process.env.CONTEXT_NAME as string,
//         {
//           url: process.env.MONGO_DB_URL,
//         }
//       )
//       const mongoUserDataSource = new MongoDBUserDataSource(clientDB)
//       const listNfts = await CCNft.methods
//         .getOwnedNfts()
//         .call({ from: account })
//       const nfts = await Promise.all(
//         listNfts.map(async function (nft: any) {
//           const { fractionData, unitPrice, fractionTokenAddress, vaultExists } =
//             await getFractionData({
//               tokenId: nft.tokenId,
//               NftFractionsFactory,
//               client,
//               NftFractionToken,
//               NftFractionsVendor,
//             })
//           const tokenURI = await CCNft.methods!.tokenURI(nft.tokenId).call()
//           const owner = await CCNft.methods.ownerOf(nft.tokenId).call()
//           const ownerName = await mongoUserDataSource.search(
//             owner.toLowerCase()
//           )
//           const ipfsHash = tokenURI.split('/ipfs/')[1]
//           const meta = await axios
//             .get(`${process.env.PINATA_GATEWAY_URL}/${ipfsHash}`, {
//               headers: {
//                 'x-pinata-gateway-token': process.env.PINATA_GATEWAY_TOKEN,
//               },
//             })
//             .then((res) => {
//               return res.data
//             })
//             .catch((err) => {
//               logger.error('Error fetching metadata from IPFS', err.message, {
//                 metadata: {
//                   service: 'web3-transactions',
//                 },
//               })
//               return null
//             })
//           const listedPrice = await NftVendor.methods
//             .getListing(nft.tokenId)
//             .call()
//           const offer = await NftOffers.methods.getNftOffer(nft.tokenId).call()
//           let bidders
//           if (offer?.nftId != 0) {
//             bidders = await NftOffers.methods
//               .getAddressesBids(offer?.nftId)
//               .call()
//           }
//           return {
//             tokenId: nft.tokenId,
//             creator: nft.creator,
//             fractions: vaultExists
//               ? {
//                   ...(fractionData as any),
//                   tokenAddress: fractionTokenAddress,
//                   unitPrice,
//                 }
//               : null,
//             owner: {
//               address: owner,
//               nickname: ownerName?.nickname || '',
//             },
//             price: listedPrice?.price?.toString(),
//             offer:
//               offer?.nftId != 0
//                 ? {
//                     bid: offer?.highestBid?.toString(),
//                     highestBidder: offer?.highestBidder,
//                     bidders,
//                   }
//                 : null,
//             meta,
//           }
//         })
//       )
//       return nfts
//     } catch (e: any) {
//       console.error(e)
//     }
//   }
