import { useMyActivity } from '@hooks/web3'
import { useEffect } from 'react'
import OffersReceived from '@ui/tables/OffersReceived'

const MyOffersReceived = () => {
  const { myActivity } = useMyActivity()

  useEffect(() => {
    myActivity.sentOffersRefetch()
  }, [])

  return (
    <div className="w-full">
      <OffersReceived
        offersReceived={myActivity?.receivedOffers}
        loading={myActivity?.loadingTransactions}
        onAccept={(tokenId: string) => myActivity?.acceptOffer(tokenId)}
      />
    </div>
  )
}

export default MyOffersReceived
