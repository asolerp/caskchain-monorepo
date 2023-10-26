import BuyoutModal from '@ui/modals/BuyoutModal'
import FractionalizedBuyout from '@ui/ntf/buyout/FractionalizedBuyout'
import MakeOffer from '@ui/ntf/buyout/MakeOffer'
import OnSale from '@ui/ntf/buyout/OnSale'
import { useCallback, useState } from 'react'

type CaskOperationsProps = {
  cask: any
}

const CaskOperations: React.FC<CaskOperationsProps> = ({ cask }) => {
  const [buyoutModalIsOpen, setBuyoutModalIsOpen] = useState<any>(false)

  const handleCancelOffer = useCallback(() => {
    cask?.cancelOffer()
  }, [cask])

  return (
    <>
      <BuyoutModal
        cask={cask?.data}
        rates={cask?.rates}
        onCompletePurchase={() => {
          cask?.buyNft(cask?.data?.tokenId, cask?.data?.price)
        }}
        isModalOpen={buyoutModalIsOpen}
        closeModal={setBuyoutModalIsOpen}
      />
      <div className="flex w-full justify-start">
        {cask?.data?.fractions?.isForSale ? (
          <FractionalizedBuyout
            cask={cask?.data}
            onFullBuy={cask?.buyFractionizedNft}
            onBuyFraction={(fractions: number) =>
              cask?.buyFractions(
                cask?.data?.fractions?.tokenAddress,
                cask?.data?.fractions?.unitPrice,
                fractions
              )
            }
          />
        ) : (
          <>
            {cask?.data?.price > 0 ? (
              <OnSale
                cask={cask?.data}
                rates={cask?.rates}
                onBuyWithERC20={() =>
                  cask?.buyWithERC20(
                    cask?.data?.tokenId,
                    cask?.data?.erc20Prices?.USDT
                  )
                }
                onBuy={() => {
                  cask?.handleUserState(() => setBuyoutModalIsOpen(true))
                }}
              />
            ) : (
              <MakeOffer
                cask={cask?.data}
                onCancelOffer={handleCancelOffer}
                onOffer={(offer) => cask?.makeOffer(offer)}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default CaskOperations
