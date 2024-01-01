import { useGlobal } from '@providers/global'

import { Button, Spacer } from 'caskchain-ui'

import React from 'react'
import Modal from 'react-modal'
import { useForm } from 'react-hook-form'

import UserInfoForm from 'components/forms/UserInfoForm'
import useProfile from 'pages/profile/hooks/useProfile'

type Props = {
  modalIsOpen: boolean
  closeModal: () => void
}

const UserInfoModal: React.FC<Props> = ({ modalIsOpen, closeModal }) => {
  const {
    state: { user },
  } = useGlobal()

  const { handleSaveUser } = useProfile()
  const onSubmit = (data: any) => {
    handleSaveUser({ formState: data })
    closeModal()
  }

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      ...user,
      dateOfBirth: user?.dateOfBirth,
      country: user?.country,
    },
  })
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
        <div className="relative w-full my-6 mx-auto lg:max-w-xl">
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <UserInfoForm
                register={register}
                errors={errors}
                control={control}
              />
              <Spacer size="lg" />
              <div className="flex items-center justify-center rounded-b">
                <Button isForm>Continue</Button>
              </div>
            </form>
            <Spacer size="lg" />
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
