import formatNumber from 'utils/formatNumber'
const MarketPlaceStats = () => {
  return (
    <>
      <div className="px-8 flex flex-col items-center space-y-2">
        <p className="text-4xl lg:text-6xl font-rale font-semibold text-cask-chain">
          {formatNumber(12000)}
        </p>
        <span className="text-white text-lg font-thin font-poppins">
          Wallets
        </span>
      </div>
      <div className="px-8 flex flex-col items-center space-y-2">
        <p className="text-4xl lg:text-6xl font-rale font-semibold text-cask-chain">
          {formatNumber(10)}
        </p>
        <span className="text-white text-lg font-thin font-poppins">
          Brands
        </span>
      </div>
      <div className="px-8 flex flex-col items-center space-y-2">
        <p className="text-4xl lg:text-6xl font-rale font-semibold text-cask-chain">
          {formatNumber(200)}
        </p>
        <span className="text-white text-lg font-thin font-poppins">Casks</span>
      </div>
    </>
  )
}

export default MarketPlaceStats
