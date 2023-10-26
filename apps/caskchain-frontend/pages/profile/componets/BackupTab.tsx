import { useGlobal } from '@providers/global'
import { Button, Spacer } from 'caskchain-ui'
import { useForm } from 'react-hook-form'

import useProfile from '../hooks/useProfile'
import BackupForm from 'components/forms/BackupForm'

const BackupTab = () => {
  const {
    state: { user },
  } = useGlobal()

  const { handleSaveBackupInfo, loading } = useProfile()
  const onSubmit = (data: any) =>
    handleSaveBackupInfo({ formState: { ...data } })

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm({
    defaultValues: {
      ...user?.backupInfo,
    },
  })

  return (
    <div className="w-full">
      <h2 className="font-relay text-white text-3xl">Backup Contact</h2>
      <Spacer size="lg" />
      <p className="font-poppins text-white text-lg w-fit">
        {`Backup contact will be contacted in the case where we are unable to reach you regarding your cask redemption. `}
      </p>
      <Spacer size="lg" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <BackupForm register={register} errors={errors} />
        <Spacer size="lg" />
        <Spacer size="lg" />
        <Button disabled={!isValid || isSubmitting} loading={loading}>
          Save
        </Button>
      </form>
      <Spacer size="lg" />
    </div>
  )
}

export default BackupTab
