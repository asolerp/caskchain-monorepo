import { Nft } from '@_types/nft'
import { useOwnedNfts } from '@hooks/web3/useOwnedNfts'

import BarrelProfile from '@ui/ntf/item/BarrelProfile'
import { Button, Spacer } from 'caskchain-ui'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const FavouritesTab = () => {
  const router = useRouter()
  const { favorites } = useOwnedNfts()

  return (
    <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
      {favorites?.length ? (
        <ul role="list" className="flex flex-row flex-wrap">
          <li className="relative col-span-1" />
          <li className="grid grid-cols-3 gap-5 col-span-5">
            {favorites &&
              favorites?.map((nft: Nft) => (
                <Link key={nft.tokenId} passHref href={`/cask/${nft.tokenId}`}>
                  <BarrelProfile key={nft.tokenId} item={nft} />
                </Link>
              ))}
          </li>
          <li className="relative col-span-1" />
        </ul>
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
            {`No favourite casks`}
          </h3>
          <Spacer size="md" />
          <Button onClick={() => router.push('/marketplace')}>Find NFTs</Button>
        </div>
      )}
    </section>
  )
}

export default FavouritesTab
