import OffersSent from '@ui/tables/OffersSent'
import { useMyActivity } from '@hooks/web3'
import { useEffect } from 'react'

const MyOffersSent = () => {
  const { myActivity } = useMyActivity()

  useEffect(() => {
    myActivity.sentOffersRefetch()
  }, [])

  return (
    <div className="w-full">
      <OffersSent
        offersSent={myActivity?.sentOffers}
        cancelOffer={(tokenId) => myActivity.cancelOffer(tokenId)}
      />
    </div>
  )
}

export default MyOffersSent
