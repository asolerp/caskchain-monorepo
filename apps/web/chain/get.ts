// const ethereum = require('./networks/ethereum')
import { polygonNetworks } from "./network/polygon";
// const bsc = require('./networks/bsc')

export const blockchain = {
    // ethereum: ethereum.mainnet,
    // ethereum_testnet: ethereum.testnet,
    polygon: polygonNetworks.mainnet,
    polygon_testnet: polygonNetworks.testnet,
    // bsc: bsc.mainnet,
    // bsc_testnet: bsc.testnet
}