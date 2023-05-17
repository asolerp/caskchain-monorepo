import Button from '@ui/common/Button'
import { upperCaseFirstLetter } from 'caskchain-lib'
import Image from 'next/image'

const LiquorFilter = ({
  liquor,
  active,
  onClick,
}: {
  onClick: () => void
  active?: boolean
  liquor: 'brandy' | 'rum' | 'tequila' | 'whiskey'
}) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={`/images/liquors/liquor_${liquor}.png`}
        alt={`filter liquor ${liquor}`}
        width={250}
        height={250}
        className={active ? 'ring-4 ring-cask-chain rounded-full' : ''}
      />
      <Button
        containerStyle="px-6 py-3 -mt-2"
        active={active}
        onClick={onClick}
      >
        {upperCaseFirstLetter(liquor)}
      </Button>
    </div>
  )
}

export default LiquorFilter
