import { useAllNfts } from '@hooks/web3'
import { BaseLayout } from '@ui'
import BarrelNft from '@ui/ntf/item/BarrelNft'

const Barrels = () => {
  const { nfts } = useAllNfts()

  return (
    <BaseLayout background="bg-gray-200">
      <div className="flex flex-col w-full  px-20 py-10">
        <h1 className="font-semibold text-4xl font-poppins text-black-light">
          Barrels
        </h1>
        <div className="flex flex-row flex-wrap space-x-4">
          {nfts?.data &&
            nfts?.data.map((nft: any) => <BarrelNft item={nft} key={nft.id} />)}
        </div>
      </div>
    </BaseLayout>
  )
}

export default Barrels
