import Modal from 'react-modal'
import { AnimatePresence, motion } from 'framer-motion'
import { Spacer } from 'caskchain-ui'
import Image from 'next/image'
import { addressSimplifier, ipfsImageParser } from 'caskchain-lib'
import { Button, Divider } from 'caskchain-ui/common'
import { ethers } from 'ethers'
import { useGlobal } from '@providers/global'
// Modal.setAppElement('#root') // Set the root element as the modal's parent

type Props = {
  cask: any
  rates: any
  onCompletePurchase: () => void
  isModalOpen: boolean
  closeModal: any
}

const attributes = [
  'liquor',
  'distillery',
  'country',
  'region',
  'cask_wood',
  'age',
  'cask_size',
  'abv',
]

const BuyoutModal: React.FC<Props> = ({
  cask,
  rates,
  onCompletePurchase,
  isModalOpen,
  closeModal,
}) => {
  const {
    state: { address },
  } = useGlobal()
  const MATICEUR = rates?.find((rate: any) => rate?._id === 'matic')?.lastPrice

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.75,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              ease: 'easeOut',
              duration: 0.15,
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.75,
            transition: {
              ease: 'easeIn',
              duration: 0.15,
            },
          }}
        >
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content: {
                width: '500px',
                height: '700px',
                margin: 'auto',
                display: 'flex',
                backgroundColor: 'rgb(27,27,27)',
                flexDirection: 'column',
                alignItems: 'center',
                borderColor: 'rgb(31,41,55)',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                transformOrigin: 'center center',
              },
            }}
          >
            <div className="grid grid-cols-5 w-full items-center">
              <div className="col-span-1"></div>
              <div className="col-span-3 flex justify-center">
                <h2 className="font-sans text-3xl text-white">Your purchase</h2>
              </div>
              <div className="col-span-1 flex justify-end">
                <p
                  onClick={() => closeModal(false)}
                  className="font-sans text-white text-2xl cursor-pointer"
                >
                  X
                </p>
              </div>
            </div>
            <Spacer size="md" />
            <Divider />
            <Spacer size="md" />
            <div className="flex flex-col items-start w-full">
              <h3 className="font-sans text-white text-3xl">1 NFT</h3>
              <Spacer size="md" />
              <div className="grid grid-cols-3 gap-4">
                <div className="flex justify-center">
                  <Image
                    src={ipfsImageParser(cask?.meta?.image)}
                    width={100}
                    height={100}
                    alt="cask image"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex flex-col items-start">
                    <p className="font-sans text-white text-xl">
                      {cask.meta.name}
                    </p>
                    <p className="font-sans text-gray-300 text-xs">
                      {`@${cask?.owner?.nickname}` ||
                        addressSimplifier(cask?.owner?.address)}
                    </p>
                  </div>
                  <Spacer size="xs" />
                  <div className="flex flex-row flex-wrap justify-start items-center">
                    {attributes.map((attr, index) => {
                      let suffix = ''
                      if (attr === 'age') suffix = ' years'
                      else if (attr === 'cask_size') suffix = 'L'
                      else if (attr === 'abv') suffix = '%'

                      const attrValue = cask?.meta?.attributes
                        .find((attribute: any) => attribute.trait_type === attr)
                        ?.value?.toUpperCase()

                      return (
                        <div className="flex items-center" key={index}>
                          <p className="text-cask-chain text-[12px]">
                            {attrValue ? attrValue + suffix : ''}
                          </p>
                          {index !== attributes.length - 1 && (
                            <p className="text-cask-chain px-1">{' · '}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            <Spacer size="md" />
            <Divider />
            <Spacer size="md" />
            <div className="w-full">
              <div className="grid grid-cols-2">
                <h3 className="font-sans text-white text-xl">Total price</h3>
                <div className="flex flex-col items-end">
                  <p className="font-sans text-white text-xl">
                    {' '}
                    {(
                      Number(ethers.utils.formatEther(cask?.price)) * MATICEUR
                    ).toFixed(2)}{' '}
                    EUR
                  </p>
                  <p className="font-sans text-white text-xl">
                    {cask?.price &&
                      ethers.utils.formatEther(cask?.price).toString()}{' '}
                    MATIC
                  </p>
                </div>
              </div>
              <Spacer size="md" />
              <h3 className="font-sans text-white text-xl">Payment method</h3>
              <Spacer size="xs" />
              <div className="border border-gray-500 rounded-lg p-3">
                <p className="text-center font-sans text-cask-chain">
                  {address}
                </p>
              </div>
            </div>
            <div className="flex flex-grow  w-full items-end">
              <Button fit={false} onClick={onCompletePurchase}>
                Complete purchase
              </Button>
            </div>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BuyoutModal
