import { BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline'

type CaskFavoriteProps = {
  onClickFavorite: () => void
  onClickShare: () => void
  isFavorite: boolean
  totalFavorites: number | undefined
}

const CaskFavorite: React.FC<CaskFavoriteProps> = ({
  onClickFavorite,
  onClickShare,
  isFavorite,
  totalFavorites,
}) => {
  return (
    <div className="flex flex-row space-x-2 w-full">
      <div
        onClick={onClickFavorite}
        className={`cursor-pointer border ${
          isFavorite ? 'border-cask-chain' : 'border-gray-600'
        }  w-fit p-2 rounded-md flex flex-row space-x-2 justify-center items-center`}
      >
        <p className="text-white">{totalFavorites}</p>
        <BookmarkIcon
          color={isFavorite ? '#CAFC01' : '#fff'}
          fill={isFavorite ? '#CAFC01' : 'transparent'}
          className="cursor-pointer"
          width={20}
          height={20}
        />
      </div>

      <div
        onClick={onClickShare}
        className={`cursor-pointer border border-gray-600  w-fit p-2 rounded-md flex flex-row space-x-2 justify-center items-center`}
      >
        <ShareIcon width={20} height={20} className="text-white" />
      </div>
    </div>
  )
}

export default CaskFavorite
