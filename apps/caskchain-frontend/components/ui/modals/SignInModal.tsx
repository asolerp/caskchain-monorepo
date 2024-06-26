import { useAccount } from '@hooks/web3/useAccount'
import Button from '@ui/common/Button'
import React from 'react'
import Modal from 'react-modal'

type Props = {
  modalIsOpen: boolean
  closeModal: () => void
}

const SignInModal: React.FC<Props> = ({ modalIsOpen, closeModal }) => {
  const { signAddress, loading } = useAccount()

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
        <div className="relative w-full lg:w-1/4  my-6 mx-auto max-w-md">
          {/*content*/}
          <div className="h-full w-full bg-black-light rounded-3xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 ">
            {/*header*/}
            <div className="grid grid-cols-3 p-5  rounded-t">
              <div></div>
              <div className="flex justify-center">
                <h3 className="text-3xl pb-2 text-center font-semibold text-white font-poppins border-b border-cask-chain w-fit">
                  Sign in
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
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="text-gray-400 text-center text-xl mb-3">
                Almost there! As a final stepo your wallet will ask you to
                digitally sign in to link it with CaskChain. Click the button to
                preceed.
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6  rounded-b">
              <Button
                loading={loading}
                onClick={() => signAddress({ callback: closeModal })}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </Modal>
  )
}

export default SignInModal
