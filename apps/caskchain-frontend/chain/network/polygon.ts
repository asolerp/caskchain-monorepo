import { networkconfig } from "chain/networkconfig"
const rpc = {
    mainnet: {
        url: 'https://polygon-rpc.com/',
        chainId: 137
    },
    testnet: {
        url: 'https://matic-mumbai.chainstacklabs.com',
        chainId: 80001
    }
}

export const polygonNetworks = {
    mainnet: networkconfig(
        rpc.mainnet.chainId,
        rpc.mainnet.url
    ),
    testnet: networkconfig(
        rpc.testnet.chainId,
        rpc.testnet.url
    )
}