import { useAccount } from '@hooks/web3'
import React from 'react'

type Props = {
  modalIsOpen: boolean
  closeModal: () => void
}

const SignInModal: React.FC<Props> = ({ modalIsOpen, closeModal }) => {
  const { account } = useAccount()

  return (
    <>
      {modalIsOpen && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-1/4 sm:w-1/2 my-6 mx-auto max-w-xl">
              {/*content*/}
              <div className="h-full w-full bg-slate-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 ">
                {/*header*/}
                <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-xl font-semibold text-amber-300">
                    SIG IN CASK CHAIN
                  </h3>
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
                  <p className="text-amber-300 font-semibold text-xl mb-3">
                    Address
                  </p>
                  <input
                    type="text"
                    value={account.data}
                    name="name"
                    id="name"
                    className="focus:ring-gray-200 font-bold focus:border-gray-200 flex-1 block w-full rounded-md sm:text-sm  bg-slate-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 text-gray-100"
                    placeholder="My Nice NFT"
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-white background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-400 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() =>
                      account.signAddress({ callback: closeModal })
                    }
                  >
                    Sign In
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

export default SignInModal
