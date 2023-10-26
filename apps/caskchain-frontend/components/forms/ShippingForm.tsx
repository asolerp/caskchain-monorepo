import Selector from '@ui/forms/Selector'
import { Input } from 'caskchain-ui'
import { getData } from 'country-list'
import { Controller } from 'react-hook-form'

type Props = {
  register: any
  errors: any
  control?: any
}

const ShippingForm: React.FC<Props> = ({ register, errors, control }) => {
  const countries = getData()
    .map((country, index) => ({
      id: index + 1,
      name: country.name,
      code: country.code,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="relative space-y-6 w-full">
      <div className="flex flex-row space-x-4 justify-between">
        <Input
          error={errors?.firstName?.message}
          register={register}
          required
          mandatory
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Fist name"
        />
        <Input
          error={errors?.lastName?.message}
          register={register}
          required
          mandatory
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Last name"
        />
      </div>
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
      <Input
        error={errors?.address?.message}
        register={register}
        required
        mandatory
        type="text"
        name="address"
        id="address"
        placeholder="Address"
      />
      <Input
        error={errors?.addressLine?.message}
        register={register}
        type="text"
        name="addressLine"
        id="addressLine"
        placeholder="Address Line"
      />
      <div className="flex flex-row space-x-4">
        <Input
          error={errors?.city?.message}
          register={register}
          errors={errors}
          required
          mandatory
          type="text"
          name="city"
          id="city"
          placeholder="City"
        />
        <Input
          error={errors?.state?.message}
          register={register}
          errors={errors}
          required
          mandatory
          type="text"
          name="state"
          id="state"
          placeholder="State"
        />
        <Input
          error={errors?.zipCode?.message}
          register={register}
          errors={errors}
          required
          mandatory
          type="text"
          name="zipCode"
          id="zipCode"
          placeholder="Postal/Zip Code"
        />
      </div>
      <Input
        error={errors?.phone?.message}
        register={register}
        errors={errors}
        type="text"
        name="phone"
        id="phone"
        placeholder="Phone"
      />
    </div>
  )
}

export default ShippingForm
