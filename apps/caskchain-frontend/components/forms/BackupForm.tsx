import { Input } from 'caskchain-ui'

type Props = {
  register: any
  errors: any
}

const BackupForm: React.FC<Props> = ({ register, errors }) => {
  return (
    <div className="relative space-y-6 w-full">
      <Input
        mandatory
        required
        error={errors?.firstName?.message}
        register={register}
        type="text"
        name="firstName"
        id="firstName"
        placeholder="Fist name"
      />
      <Input
        mandatory
        required
        error={errors?.lastName?.message}
        register={register}
        type="text"
        name="lastName"
        id="lastName"
        placeholder="Last name"
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
        error={errors?.phone?.message}
        register={register}
        type="text"
        name="phone"
        id="phone"
        placeholder="Phone"
      />
    </div>
  )
}

export default BackupForm
