import { Button, Spacer } from 'caskchain-ui'
import UserInfoForm from 'components/forms/UserInfoForm'

import useProfile from '../hooks/useProfile'
import { useForm } from 'react-hook-form'
import ImageProfileUploader from 'components/pages/profile/ImageProfileUploader'
import { useAccount } from '@hooks/web3/useAccount'

const ProfileTab = () => {
  const { user } = useAccount()
  const { handleSaveUser, loading } = useProfile()
  const onSubmit = (data: any) => handleSaveUser({ formState: data })

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      ...user,
      country: user?.country,
    },
  })

  return (
    <div className="w-full">
      <h2 className="font-relay text-white text-3xl">Profile</h2>
      <Spacer size="lg" />
      <div className="flex justify-start items-center">
        <ImageProfileUploader />
      </div>
      <Spacer size="lg" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <UserInfoForm register={register} errors={errors} control={control} />
        <Spacer size="lg" />
        <p className="font-poppins text-white text-lg w-fit">
          {`By completing your profile, you will be the first to know about our new
        launches and you'll get access to exclusive perks, offers and
        invitations to VIP events.`}
        </p>
        <Spacer size="lg" />
        <Button isForm disabled={!isValid || isSubmitting} loading={loading}>
          Save
        </Button>
      </form>
      <Spacer size="lg" />
    </div>
  )
}

export default ProfileTab
