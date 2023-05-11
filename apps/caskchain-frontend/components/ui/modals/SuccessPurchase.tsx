import { Nft } from '@_types/nft'

import Button from '@ui/common/Button'
import React from 'react'
import Image from 'next/image'
import Modal from 'react-modal'
import { ipfsImageParser } from 'utils/ipfsImageParser'
import Spacer from '@ui/common/Spacer'

type Props = {
  modalIsOpen: boolean
  closeModal: () => void
  cask: Nft
}

const SuccessPurchaseModal: React.FC<Props> = ({
  cask,
  modalIsOpen,
  closeModal,
}) => {
  return (
    <Modal
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: '#A8A8A880',
        },
        content: {
          backgroundColor: 'transparent',
          border: 0,
        },
      }}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
    >
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative lg:w-2/4 w-1/2 my-6 mx-auto  ">
          {/*content*/}
          <div className="h-full w-full bg-black-light rounded-3xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 ">
            {/*header*/}
            <div className="grid grid-cols-5 p-5 pt-10 rounded-t">
              <div></div>
              <div className="flex justify-center col-span-3">
                <h3 className="text-3xl pb-2 text-center font-semibold text-white font-poppins border-b border-cask-chain w-fit">
                  Congratulations! 🎉
                </h3>
              </div>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                onClick={closeModal}
              >
                <span className="bg-transparent text-white text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <Spacer size="lg" />
            {/*body*/}
            <div className="relative p-6 grid grid-cols-2">
              <div className="flex items-center justify-center">
                <Image
                  src={ipfsImageParser(cask?.meta?.image)}
                  width={350}
                  height={700}
                  alt={cask?.meta?.name}
                  className="rounded-xl"
                ></Image>
              </div>
              <div className="flex flex-col items-starat justify-center">
                <h2 className="font-poppins text-left font-bold text-white text-3xl">
                  {cask?.meta?.name}
                </h2>
                <Spacer size="lg" />
                <p className="text-gray-400 text-left text-xl mb-3">
                  You have successfully acquired the NFT that represents
                  ownership of a distinguished barrel of liquor.
                </p>
                <p className="text-gray-400 text-left text-xl mb-3">
                  As the proud owner of this NFT, you can now enjoy the
                  assurance that your investment in this exquisite liquor is
                  verifiable and secure. Rest easy knowing that blockchain
                  technology is safeguarding your ownership rights and adding
                  value to your collection.
                </p>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6  rounded-b">
              <Button onClick={() => closeModal()}>Close</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </Modal>
  )
}

export default SuccessPurchaseModal
