type SizesProps = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
const Spacer = ({
  size = 'md',
  lg,
  sm,
}: {
  size?: SizesProps
  lg?: SizesProps
  sm?: SizesProps
}) => {
  const spacingClass = {
    xs: 'mb-2',
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-8',
    xl: 'mb-10',
    '2xl': 'mb-12',
    '3xl': 'mb-16',
  }
  return (
    <div
      className={`${sm ? `${spacingClass[sm]}` : `${spacingClass[size]}`} ${
        lg ? `lg:${spacingClass[lg]}` : `lg:${spacingClass[size]}`
      }`}
    ></div>
  )
}

export default Spacer
