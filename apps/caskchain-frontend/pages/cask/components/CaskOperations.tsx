import BuyoutModal from '@ui/modals/BuyoutModal'
import MakeOffer from '@ui/ntf/buyout/MakeOffer'
import OnSale from '@ui/ntf/buyout/OnSale'
import { useCallback, useState } from 'react'

type CaskOperationsProps = {
  data: any
  rates: any
  buyNft: (tokenId: number, price: string, callback: any) => Promise<void>
  makeOffer: (offer: any) => void
  cancelOffer: () => void
  buyWithERC20: (tokenId: number, price: string) => void
  handleUserState: (callback: () => void) => void
}

const CaskOperations: React.FC<CaskOperationsProps> = ({
  data,
  rates,
  buyNft,
  makeOffer,
  cancelOffer,
  buyWithERC20,
  handleUserState,
}) => {
  const [buyoutModalIsOpen, setBuyoutModalIsOpen] = useState<any>(false)

  const handleCancelOffer = useCallback(() => {
    cancelOffer()
  }, [cancelOffer])

  return (
    <>
      <BuyoutModal
        cask={data}
        rates={rates}
        onCompletePurchase={() => {
          buyNft(data?.tokenId, data?.price, () => setBuyoutModalIsOpen(false))
        }}
        isModalOpen={buyoutModalIsOpen}
        closeModal={setBuyoutModalIsOpen}
      />
      <div className="flex w-full justify-start">
        <>
          {data?.price > 0 ? (
            <OnSale
              cask={data}
              rates={rates}
              onBuyWithERC20={() => buyWithERC20(data?.tokenId, data?.price)}
              onBuy={() => {
                handleUserState(() => setBuyoutModalIsOpen(true))
              }}
            />
          ) : (
            <MakeOffer
              cask={data}
              onCancelOffer={handleCancelOffer}
              onOffer={(offer) => makeOffer(offer)}
            />
          )}
        </>
      </div>
    </>
  )
}

export default CaskOperations
