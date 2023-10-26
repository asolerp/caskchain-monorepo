import { BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline'

type CaskFavoriteProps = {
  cask: any
}

const CaskFavorite: React.FC<CaskFavoriteProps> = ({ cask }) => {
  return (
    <div className="flex flex-row space-x-2 w-full">
      <div
        onClick={() => cask.debounceAddFavorite()}
        className={`cursor-pointer border ${
          cask.isFavorite ? 'border-cask-chain' : 'border-gray-600'
        }  w-fit p-2 rounded-md flex flex-row space-x-2 justify-center items-center`}
      >
        <p className="text-white">{cask.totalFavorites}</p>
        <BookmarkIcon
          color={cask.isFavorite ? '#CAFC01' : '#fff'}
          fill={cask.isFavorite ? '#CAFC01' : 'transparent'}
          className="cursor-pointer"
          width={20}
          height={20}
        />
      </div>

      <div
        onClick={() => cask.handleShareCask()}
        className={`cursor-pointer border border-gray-600  w-fit p-2 rounded-md flex flex-row space-x-2 justify-center items-center`}
      >
        <ShareIcon width={20} height={20} className="text-white" />
      </div>
    </div>
  )
}

export default CaskFavorite
