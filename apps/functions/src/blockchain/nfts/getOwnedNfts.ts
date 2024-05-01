/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import cors from "cors";
import { log } from "firebase-functions/logger";
import { getContract } from "../../web3";
import {
  BLOCKCHAIH_URL,
  CCNFT_CONTRACT_ADDRESS,
  REGION,
  // NFT_VENDOR_CONTRACT_ADDRESS,
} from "../../constants";

import CCNFTABI from "../../contracts/CCNft.json";
// import NFTVENDORABI from "../../contracts/NFTVendor.json";
import { verifyAuthToken } from "../../utils/authHelper";
import { ethers } from "ethers";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });
const provider = new ethers.JsonRpcProvider(BLOCKCHAIH_URL as string);

export const getOwnedNfts = functions
  .region(REGION)
  .https.onRequest(async (req: Request, res: Response): Promise<void> => {
    corsHandler(req, res, async () => {
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")
      ) {
        res.status(403).send("Unauthorized");
        return;
      }

      const idToken = req.headers.authorization.split("Bearer ")[1];

      try {
        const decodedToken = await verifyAuthToken(idToken);
        const uid = decodedToken.uid;

        const ccNft = getContract(
          CCNFT_CONTRACT_ADDRESS as string,
          CCNFTABI.abi,
          provider
        );

        // const nftVendor = getContract(
        //   NFT_VENDOR_CONTRACT_ADDRESS as string,
        //   NFTVENDORABI.abi,
        //   provider
        // );

        const listNfts = await ccNft.getOwnedNfts({
          from: uid,
        });

        const nfts = await Promise.all(
          listNfts.map(async (nft: any) => {
            const nftId = nft[0].toString();

            const nftResponse = await admin
              .firestore()
              .collection("casks")
              .doc(nftId)
              .get();

            const nftData = nftResponse.data();

            return {
              tokenId: nftId,
              creator: nftData?.creator,
              owner: nftData?.owner,
              price: nftData?.price,
              meta: {
                name: nftData?.name,
                description: nftData?.description,
                image: nftData?.image,
                attributes: nftData?.attributes,
              },
            };
          })
        );

        res.status(200).json({
          nfts,
          error: null,
        });
      } catch (error) {
        log("Error getting documents: ", error);
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
