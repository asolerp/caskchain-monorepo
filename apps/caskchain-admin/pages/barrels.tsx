import { useAllNfts } from '@hooks/web3'
import { BaseLayout } from '@ui'

import NftList from '@ui/tables/NftList'
import { Button, Spacer } from 'caskchain-ui'
import { useRouter } from 'next/router'
import { auth } from 'utils/auth'

export const getServerSideProps = (context: any) => auth(context, 'admin')

const Barrels = () => {
  const { nfts } = useAllNfts()
  const router = useRouter()

  return (
    <BaseLayout background="bg-gray-200">
      <div className="flex flex-col w-full  px-20 py-10">
        <h1 className="font-semibold text-4xl font-poppins text-black-light">
          Barrels
        </h1>
        <Spacer size="md" />
        <Button onClick={() => router.push('/create')}>New barrel</Button>
        <Spacer size="md" />

        <NftList
          barrels={nfts.data}
          pageSize={nfts.pageSize}
          onClickPage={(page: string) => nfts.setPage(page)}
        />
      </div>
    </BaseLayout>
  )
}

export default Barrels
