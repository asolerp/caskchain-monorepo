import { useGlobal } from '@providers/global'
import { Button, Spacer } from 'caskchain-ui'
import { useForm } from 'react-hook-form'

import useProfile from './hooks/useProfile'
import ShippingForm from 'components/forms/ShippingForm'

const ShippingTab = () => {
  const {
    state: { user },
  } = useGlobal()

  const { handleSaveShippingInfo, loading } = useProfile()
  const onSubmit = (data: any) =>
    handleSaveShippingInfo({ formState: { ...data } })

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      ...user?.shippingInfo,
    },
  })

  return (
    <div className="w-full">
      <h2 className="font-relay text-white text-3xl">Shipping Address</h2>
      <Spacer size="lg" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ShippingForm register={register} errors={errors} control={control} />
        <Spacer size="lg" />
        <Button isForm disabled={!isValid || isSubmitting} loading={loading}>
          Save
        </Button>
      </form>
      <Spacer size="lg" />
    </div>
  )
}

export default ShippingTab
