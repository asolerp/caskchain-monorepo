import { useMyActivity } from '@hooks/web3'
import { BaseLayout } from '@ui'

import { NextPage } from 'next'

import { useRouter } from 'next/router'

import { motion } from 'framer-motion'
import Spacer from '@ui/common/Spacer'
import { auth } from 'utils/auth'
import { useEffect } from 'react'
import OffersSent from '@ui/tables/OffersSent'
import OffersReceived from '@ui/tables/OffersReceived'

const tabs = [
  { name: 'Transactions', href: '#', key: 'transactions' },
  { name: 'Offers received', href: '#', key: 'offers-received' },
  { name: 'Offers sent', href: '#', key: 'offers-sent' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps = (context: any) => auth(context, 'user')

const Transactions: NextPage = () => {
  const router = useRouter()
  const { myActivity } = useMyActivity()
  const _selectedTab = (router.query.tab as string) ?? 'transactions'
  const selectedIndex = tabs.map((t) => t.key).indexOf(_selectedTab) ?? 0

  useEffect(() => {
    if (_selectedTab === 'offers-sent') {
      myActivity.sentOffersRefetch()
    }
    if (_selectedTab === 'offers-received') {
      myActivity.receivedOffersRefetch()
    }
    if (_selectedTab === 'transactions') {
      myActivity.transactionsRefetch()
    }
  }, [_selectedTab])

  if (!router.isReady) {
    return null
  }

  return (
    <>
      <BaseLayout background="bg-gradient-to-r from-[#0F0F0F] via-[#161616] to-[#000000]">
        <div className="py-16 sm:px-6 pt-40 w-3/4  px-4">
          <h2 className="tracking-tight font-extrabold text-gray-100 font-rale sm:text-6xl">
            Activity
          </h2>
          <Spacer size="md" />
          <p className="text-gray-400 font-poppins">
            Here’s a list of your transactions. You can view the details on
            Polygon to keep track of what’s happening!
          </p>
          <div className="flex flex-row space-x-6 mt-14">
            <nav
              className=" -mb-px flex space-x-6 xl:space-x-8  w-full"
              aria-label="Tabs"
            >
              {tabs.map((tab, index) => (
                <a
                  onClick={() =>
                    router.replace(`/activity/${tab.key}`, undefined, {
                      shallow: true,
                    })
                  }
                  key={tab.name}
                  aria-current={selectedIndex === index ? 'page' : undefined}
                  className={classNames(
                    selectedIndex === index
                      ? ' text-cask-chain'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap pb-2 px-1 font-medium text-2xl cursor-pointer'
                  )}
                >
                  {tab.name}
                  {selectedIndex === index && (
                    <motion.div
                      layoutId="underline"
                      className="border-b-2 border-cask-chain"
                    />
                  )}
                </a>
              ))}
            </nav>
          </div>
          <div className="mx-auto mt-20">
            <div className="flex flex-row space-x-6 flex-wrap mx-auto lg:max-w-none">
              {_selectedTab === 'offers-sent' && (
                <>
                  {myActivity?.sentOffers?.length === 0 ? (
                    <div className="w-full flex flex-col border border-gray-700 p-6 rounded-lg justify-center items-center">
                      <h3 className="font-poppins text-2xl text-gray-300">
                        {`You haven't sent any offers yet.`}
                      </h3>
                    </div>
                  ) : (
                    <OffersSent offersSent={myActivity?.sentOffers} />
                  )}
                </>
              )}
              {_selectedTab === 'offers-received' && (
                <>
                  {myActivity?.receivedOffers?.length === 0 ? (
                    <div className="w-full flex flex-col border border-gray-700 p-6 rounded-lg justify-center items-center">
                      <h3 className="font-poppins text-2xl text-gray-300">
                        {`You haven't received any offers yet.`}
                      </h3>
                    </div>
                  ) : (
                    <OffersReceived
                      onAccept={(tokenId: string) =>
                        myActivity?.acceptOffer(tokenId)
                      }
                      offersReceived={myActivity?.receivedOffers}
                    />
                  )}
                </>
              )}
              {_selectedTab === 'transactions' && (
                <>
                  {/* {myActivity?.transactions?.length === 0 ? (
                    <div className="w-full flex flex-col border border-gray-700 p-6 rounded-lg justify-center items-center">
                      <h3 className="font-poppins text-2xl text-gray-300">
                        {`There is no transactions with your address.`}
                      </h3>
                    </div>
                  ) : (
                    <TransactionsHistory
                      transactions={myActivity?.transactions}
                    />
                  )} */}
                </>
              )}
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  )
}

export default Transactions
