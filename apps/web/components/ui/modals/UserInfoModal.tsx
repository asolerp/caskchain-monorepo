import { useAccount } from '@hooks/web3'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import React, { useState } from 'react'

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
    <>
      {modalIsOpen && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-1/4 sm:w-1/2 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="h-full w-full bg-slate-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 ">
                {/*header*/}
                <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-xl font-semibold text-amber-300">
                    Create account with metamask
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-gray-100 float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={closeModal}
                  >
                    <span className="bg-transparent text-gray-100 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="text-gray-200 mb-5">
                    {
                      'Your email address is only used to send you important updates. Your nickname is how other CryptoKitties players will identify you.'
                    }
                  </p>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    name="email"
                    id="email"
                    className="w-full bg-transparent  mt-2 text-xl text-gray-100 focus:ring-0 rounded-lg "
                    placeholder="Your email address"
                  />
                  <input
                    onChange={(e) => setNickname(e.target.value)}
                    value={nickname}
                    type="text"
                    name="name"
                    id="name"
                    className="w-full bg-transparent border-0 mt-2 text-xl text-gray-100 focus:ring-0 rounded-lg "
                    placeholder="Nickname (optional)"
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-gray-100 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
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
                              payload: { state: true },
                            })
                          }, 300)
                        },
                      })
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  )
}

export default UserInfoModal
