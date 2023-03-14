import React from 'react'

type SizesProps = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
const Spacer = ({ size }: { size: SizesProps }) => {
  const spacingClass = {
    xs: 'mb-2',
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-8',
    xl: 'mb-10',
    '2xl': 'mb-12',
    '3xl': 'mb-16',
  }
  return <div className={`${spacingClass[size]}`}></div>
}

export default Spacer
