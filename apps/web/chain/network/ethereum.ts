import { networkconfig } from "chain/networkconfig"
const rpc = {
    mainnet: {
        url: '127.0.0.1',
        chainId: 137
    },
    testnet: {
        url: '127.0.0.1',
        chainId: 80001
    }
}

export const ethereumNetworks = {
    mainnet: networkconfig(
        rpc.mainnet.chainId,
        rpc.mainnet.url
    ),
    testnet: networkconfig(
        rpc.testnet.chainId,
        rpc.testnet.url
    )
}