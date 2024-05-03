import { useMyActivity } from '@hooks/web3/useMyActivity'
import OffersSent from '@ui/tables/OffersSent'

import { useEffect } from 'react'

const MyOffersSent = () => {
  const { sentOffersRefetch, sentOffers, cancelOffer } = useMyActivity()

  useEffect(() => {
    sentOffersRefetch()
  }, [])

  return (
    <div className="w-full">
      <OffersSent
        offersSent={sentOffers}
        cancelOffer={(tokenId) => cancelOffer(tokenId)}
      />
    </div>
  )
}

export default MyOffersSent
