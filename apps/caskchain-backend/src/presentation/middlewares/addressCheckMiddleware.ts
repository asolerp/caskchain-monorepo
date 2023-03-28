import { NextFunction, Request, Response } from 'express'
import * as util from 'ethereumjs-util'

export const addressCheckMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = req?.session?.messageSession

  let nonce: string | Buffer =
    '\x19Ethereum Signed Message:\n' +
    JSON.stringify(message).length +
    JSON.stringify(message)

  nonce = util.keccak(Buffer.from(nonce, 'utf-8'))

  // SIGNER
  const { v, r, s } = util.fromRpcSig(req.body.signature)
  const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s)
  const addressBuffer = util.pubToAddress(pubKey)
  const address = util.bufferToHex(addressBuffer)

  if (address === req.body.address) {
    next()
  } else {
    res.status(422).send('Wrong address')
  }
}
