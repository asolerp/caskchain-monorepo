import { useAccount } from '@hooks/web3'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import Button from '@ui/common/Button'
import Input from '@ui/common/Input'
import Spacer from '@ui/common/Spacer'
import React, { useState } from 'react'
import Modal from 'react-modal'

type Props = {
  modalIsOpen: boolean
  closeModal: () => void
}

const UserInfoModal: React.FC<Props> = ({ modalIsOpen, closeModal }) => {
  const { account } = useAccount()

  const {
    dispatch,
    state: { user },
  } = useGlobal()
  const [email, setEmail] = useState<string>('')
  const [nickname, setNickname] = useState<string>('')

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
        <div className="relative w-1/4 sm:w-1/2 my-6 mx-auto max-w-md">
          {/*content*/}
          <div className="h-full w-full bg-black-light rounded-3xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 p-6">
            {/*header*/}
            <div className="grid grid-cols-5 rounded-t">
              <div></div>
              <div className="col-span-3 flex items-center justify-center">
                <h3 className="text-3xl pb-2 w-fit  text-center font-semibold text-white font-poppins border-b border-cask-chain">
                  Create account
                </h3>
              </div>
              <button
                className="w-10 p-1 ml-auto bg-transparent border-0 text-gray-100 float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                onClick={closeModal}
              >
                <span className="bg-transparent text-gray-100 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <Spacer size="md" />
            <div className="relative flex-auto">
              <p className="text-gray-400 text-center text-lg mb-3">
                Your email address is only used to send you important updates.
                Your nickname is how other CaskChain users will identify you.
              </p>
              <Spacer size="md" />
              <Input
                onChange={(e: any) => setEmail(e.target.value)}
                value={email}
                type="text"
                name="email"
                id="email"
                placeholder="Your email address"
              />
              <Input
                onChange={(e: any) => setNickname(e.target.value)}
                value={nickname}
                type="text"
                name="name"
                id="name"
                placeholder="Nickname (optional)"
              />
            </div>
            <Spacer size="md" />
            <div className="flex items-center justify-center rounded-b">
              <Button
                onClick={() => {
                  account.handelSaveUser({
                    id: user._id,
                    email,
                    nickname,
                    callback: () => {
                      closeModal()
                      setTimeout(() => {
                        return dispatch({
                          type: GlobalTypes.SET_SIGN_IN_MODAL,
                          payload: { status: true },
                        })
                      }, 300)
                    },
                  })
                }}
              >
                Continue
              </Button>
            </div>
            <Spacer size="md" />
            <div>
              <p className="text-center text-gray-300 text-sm font-poppins">
                By signing up, you agree to our{' '}
                <span className="text-cask-chain">Terms of Service</span> and{' '}
                <span className="text-cask-chain">Privay Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </Modal>
  )
}

export default UserInfoModal
