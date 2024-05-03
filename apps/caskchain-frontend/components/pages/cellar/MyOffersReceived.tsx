import { useEffect } from 'react'
import OffersReceived from '@ui/tables/OffersReceived'
import { useMyActivity } from '@hooks/web3/useMyActivity'

const MyOffersReceived = () => {
  const {
    sentOffersRefetch,
    receivedOffers,
    loadingTransactions,
    acceptOffer,
  } = useMyActivity()

  useEffect(() => {
    sentOffersRefetch()
  }, [])

  return (
    <div className="w-full">
      <OffersReceived
        offersReceived={receivedOffers}
        loading={loadingTransactions}
        onAccept={(tokenId: string) => acceptOffer(tokenId)}
      />
    </div>
  )
}

export default MyOffersReceived
