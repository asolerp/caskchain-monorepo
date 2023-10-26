import { Nft } from '@_types/nft'
import { useOwnedNfts } from '@hooks/web3'
import BarrelProfile from '@ui/ntf/item/BarrelProfile'
import { Button, Spacer } from 'caskchain-ui'
import Image from 'next/image'
import { useRouter } from 'next/router'

const CasksTab = () => {
  const router = useRouter()
  const { nfts } = useOwnedNfts()

  return (
    <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
      {nfts.data.length ? (
        <>
          <ul role="list" className="flex flex-row flex-wrap">
            <li className="relative col-span-1" />
            <li className="grid grid-cols-3 gap-5 col-span-5">
              {(nfts?.data as Nft[])?.map((nft) => (
                <BarrelProfile
                  key={nft.tokenId}
                  // onPressProfileCTA={() => {
                  //   setSelectedBarrelId(nft.tokenId)
                  //   setIsListModalOpen(true)
                  // }}
                  item={nft}
                />
              ))}
            </li>
            <li className="relative col-span-1" />
          </ul>
          <Spacer size="xl" />
        </>
      ) : (
        <div className="flex flex-col  p-6 rounded-lg justify-center items-center">
          <Image
            src="/icons/barrels.svg"
            width={150}
            height={150}
            alt="empty favourites"
          />
          <Spacer size="md" />
          <h3 className="font-poppins text-2xl text-gray-500 font-thin tracking-wider">
            {`No owned casks`}
          </h3>
          <Spacer size="md" />
          <Button onClick={() => router.push('/marketplace')}>Buy NFTs</Button>
        </div>
      )}
    </section>
  )
}

export default CasksTab
