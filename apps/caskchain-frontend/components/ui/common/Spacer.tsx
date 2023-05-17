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
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-10',
    '2xl': 'h-12',
    '3xl': 'h-16',
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
