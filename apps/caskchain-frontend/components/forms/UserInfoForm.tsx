import Selector from '@ui/forms/Selector'
import { Input } from 'caskchain-ui'
import { Controller } from 'react-hook-form'

import { getData } from 'country-list'
import { CustomDatePicker } from 'caskchain-ui/common'

type Props = {
  register: any
  control?: any
  errors: any
}

const UserInfoForm: React.FC<Props> = ({ register, control, errors }) => {
  const countries = getData()
    .map((country, index) => ({
      id: index + 1,
      name: country.name,
      code: country.code,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-6">
      <Input
        error={errors?.firstName?.message}
        register={register}
        type="text"
        name="firstName"
        id="firstName"
        placeholder="Fist name"
      />
      <Input
        error={errors?.lastName?.message}
        register={register}
        type="text"
        name="lastName"
        id="lastName"
        placeholder="Last name"
      />
      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => (
          <CustomDatePicker
            selectedDate={field.value ? new Date(field.value) : null}
            onChangeDate={field.onChange}
            placeholder="Date of birth"
          />
        )}
      />

      <Input
        error={errors?.email?.message}
        register={register}
        type="text"
        name="email"
        id="email"
        placeholder="Your email address"
      />
      <Input
        error={errors?.nickname?.message}
        register={register}
        type="text"
        name="nickname"
        id="name"
        placeholder="Nickname"
      />
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <Selector
            value={field.value}
            onChange={field.onChange}
            placeholder="Select your country"
            list={countries}
          />
        )}
      />
    </div>
  )
}

export default UserInfoForm
