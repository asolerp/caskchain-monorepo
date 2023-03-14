import { Nft } from '../../../../types/nft'

type NftItemProps = {
  item: Nft
  burnNft?: (tokenId: number) => Promise<void>
  buyNftWithEUR?: (tokenId: number, address: string) => Promise<void>
  buyNftWithERC20?: (
    tokenId: number,
    erc20Token: string,
    price: number
  ) => Promise<void>
  buyShares?: (
    tokenId: number,
    shares: number,
    sharePrice: number
  ) => Promise<void>
  buyNft?: (tokenId: number, price: number) => Promise<void>
  makeOffer?: (tokenId: number, offer: string) => Promise<void>
  withdraw?: (tokenId: number) => Promise<void>
  withTransactions?: boolean
  showOwner?: boolean
}

// const ERC20TokenNames: any = {
//   [process.env.NEXT_PUBLIC_USDT_TOKEN as string]: 'USDT',
// }

const NftItem: React.FC<NftItemProps> = ({
  item,
  // withdraw,
  // makeOffer,
  // buyNft,
  // burnNft,
  // buyShares,
  // buyNftWithEUR,
  // buyNftWithERC20,
  showOwner = false,
  // withTransactions = true,
}) => {
  // const { account } = useAccount()
  // const [address, setAddress] = useState('')
  // const [offer, setOffer] = useState('')

  console.log('ITEM', item)

  return (
    <>
      <div className="flex-shrink-0 relative h-52 flex justify-center items-center">
        <img
          className={`absolute h-52 w-full object-cover top-0`}
          src={item.meta.image}
          alt="New NFT"
        />
        <img
          className={`h-28 w-42 object-cover flex justify-center items-center z-10 rounded-full`}
          src={'/suau_logo.png'}
          alt="New NFT"
        />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          {showOwner && (
            <div className="flex flex-row justify-between">
              <p className=" text-indigo-600 mb-5">Owner</p>
              <p>{`0x${item.owner[2]}${item.owner[3]}${
                item.owner[4]
              }....${item.owner.slice(-4)}`}</p>
            </div>
          )}
          <p className="text-sm font-medium text-indigo-600">Cask NFT</p>
          <div className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">
              {item.meta.name}
            </p>
            <p className="mt-3 mb-3 text-base text-gray-500">
              {item.meta.description}
            </p>
          </div>
        </div>
        {/* {item.isLocked ? (
          <>
            <p className="mb-5">Fractions Available: {item.shares}</p>
            <div className="flex flex-col items-center">
              <div className="w-1/2 mb-5">
                <CircularProgressbarWithChildren
                  value={
                    Math.round(sliderShares / 10) ||
                    item.totalShares - item.shares
                  }
                  maxValue={item.totalShares}
                  styles={{
                    // Customize the root svg element
                    root: {},
                    // Customize the path, i.e. the "completed progress"
                    path: {
                      // Path color
                      stroke: `rgba(62, 152, 199, ${item.shares})`,
                      // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                      strokeLinecap: 'butt',
                      // Customize transition animation
                      transition: 'stroke-dashoffset 0.5s ease 0s',
                      // Rotate the path
                      transform: 'rotate(0.25turn)',
                      transformOrigin: 'center center',
                    },
                    // Customize the circle behind the path, i.e. the "total progress"
                    trail: {
                      // Trail color
                      stroke: '#d6d6d6',
                      // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                      strokeLinecap: 'butt',
                      // Rotate the trail
                      transform: 'rotate(0.25turn)',
                      transformOrigin: 'center center',
                    },
                    // Customize the text
                    text: {
                      // Text color
                      fill: '#f88',
                      // Text size
                      fontSize: '16px',
                    },
                    // Customize background - only used when the `background` prop is true
                    background: {
                      fill: '#3e98c7',
                    },
                  }}
                >
                  <p className="font-semibold text-xl">
                    {Math.round(sliderShares / 10) ||
                      item.totalShares - item.shares}
                  </p>
                </CircularProgressbarWithChildren>
              </div>
              <Slider
                value={sliderShares}
                setValue={setSliderShares}
                minValue={item.totalShares - item.shares}
              />
              {item.totalShares} /{' '}
              {(item.totalShares -
                Math.round(sliderShares / 10) -
                item.shares) *
                -1}
              <button
                onClick={async () =>
                  await buyShares(
                    item.tokenId,
                    (item.totalShares -
                      Math.round(sliderShares / 10) -
                      item.shares) *
                      -1,
                    item.price / item.totalShares
                  )
                }
                type="button"
                className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 mb-2 mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Buy shares / fractions
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="overflow-hidden mb-4">
              <dl className="-mx-4 -mt-4 flex flex-wrap">
                <div className="flex flex-col px-4 pt-4">
                  <dt className="order-2 text-sm font-medium text-gray-500">
                    Price
                  </dt>
                  <dd className="order-1 text-xl font-extrabold text-indigo-600">
                    <div className="flex justify-center items-center">
                      {ethers.utils.formatEther(item.price)} ETH
                    </div>
                  </dd>
                </div>
                {item.meta.attributes.map((attribute) => (
                  <div
                    key={attribute.trait_type}
                    className="flex flex-col px-4 pt-4"
                  >
                    <dt className="order-2 text-sm font-medium text-gray-500">
                      {attribute.trait_type}
                    </dt>
                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                      {attribute.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex-row mt-6">
              <>
                {item.owner !== account.data && (
                  <>
                    {item?.bidders?.some((bid) => bid === account.data) ? (
                      <button
                        onClick={() => withdraw(item.tokenId)}
                        type="button"
                        className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 mb-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Withdraw
                      </button>
                    ) : (
                      <>
                        <input
                          onChange={(e) => setOffer(e.target.value)}
                          type="text"
                          id="first_name"
                          className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="ETH offer"
                          required
                        ></input>
                        <button
                          onClick={async () =>
                            await makeOffer(item.tokenId, offer)
                          }
                          type="button"
                          className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 mb-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Make Offer
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            </div>
            {withTransactions && (
              <div>
                <div className="flex-row">
                  <button
                    onClick={() => buyNft(item.tokenId, item.price)}
                    type="button"
                    className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Buy with ETH
                  </button>
                  {item.erc20Prices?.map((erc20) => {
                    return (
                      <button
                        key={erc20.address}
                        onClick={() =>
                          buyNftWithERC20(
                            item.tokenId,
                            erc20.address,
                            erc20.price
                          )
                        }
                        type="button"
                        className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Buy with {ERC20TokenNames[erc20.address]} {erc20.price}
                      </button>
                    )
                  })}
                </div>
                {item.creator === item.owner && (
                  <div className="flex-row mt-6">
                    <input
                      onChange={(e) => setAddress(e.target.value)}
                      type="text"
                      id="first_name"
                      className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="ETH Adress"
                      required
                    ></input>
                    <button
                      onClick={() => buyNftWithEUR(item.tokenId, address)}
                      type="button"
                      className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 mb-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Buy with EUR
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Preview
                </button>
                {item.creator === account.data && (
                  <button
                    onClick={() => burnNft(item.tokenId)}
                    type="button"
                    className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Burn NFT with ETH
                  </button>
                )}
              </div>
            )}
          </div>
        )} */}
      </div>
    </>
  )
}

export default NftItem
