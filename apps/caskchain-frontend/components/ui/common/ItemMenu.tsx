import { ChevronRightIcon } from '@heroicons/react/24/outline'

type ItemMenuProps = {
  leftSide: React.ReactNode
  rightSide?: React.ReactNode
  onClick?: () => void
}

const ItemMenu: React.FC<ItemMenuProps> = ({
  leftSide,
  rightSide,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer w-full flex justify-between  items-center p-4"
    >
      <div>{leftSide}</div>
      {rightSide ? (
        <div>{rightSide}</div>
      ) : (
        <div>
          <ChevronRightIcon
            width={20}
            height={20}
            color="#B8B8B8"
          ></ChevronRightIcon>
        </div>
      )}
    </div>
  )
}

export default ItemMenu
