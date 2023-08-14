import { v4 as uuidv4 } from 'uuid'

export const generateNonce = () => {
  const uuid = uuidv4()

  const nonce: string | Buffer =
    '\x19Welcome to CaskChain Marketplace, the premium destination for trading and purchasing rare and unique casks.\n\n' +
    `\x19Nonce: ${uuid}\n` +
    `\x19IMPORTANT: This nonce ${uuid} is unique to this message and should only be used once. Please do not share this message or nonce with anyone else to maintain the security and integrity of your transaction.\n\n` +
    `\x19Please proceed to CaskChain Marketplace to begin your transactions.\n\n` +
    `\x19Thank you\n` +
    `\x19CaskChain Team\n`
  return nonce
}
