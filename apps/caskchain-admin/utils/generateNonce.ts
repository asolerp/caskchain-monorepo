import { v4 as uuidv4 } from 'uuid'

export const generateNonce = () => {
  const nonce: string | Buffer =
    '\x19Welcome to CaskChain:\n\n' +
    '\x19To avoid digital cask burglars, sign below to authenticate with CaskChain.\n\n' +
    `\x19Nonce: ${uuidv4()}\n`

  return nonce
}
