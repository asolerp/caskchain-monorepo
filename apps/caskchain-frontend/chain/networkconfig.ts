import HDWalletProvider  from '@truffle/hdwallet-provider'
import { Credentials } from '@truffle/hdwallet-provider/dist/constructor/LegacyConstructor'
import { ProviderOrUrl } from '@truffle/hdwallet-provider/dist/constructor/types'

const privateKeys = [process.env.PRIVATE_KEY] as Credentials
const walletAddress = process.env.WALLET_ADDRESS as ProviderOrUrl

export const networkconfig = (network_id: any, url: any) => {
    return {
        network_id,
        provider: () => new HDWalletProvider(
            privateKeys,
            url
        ),
        from: walletAddress,
        gas: 5000000,
        confirmations: 4,
        timeoutBlocks: 10000
    }
}

