import Link from 'next/link'
import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'

type LinkProps = {
  href: string
  children: ReactElement
  activeclass: string
}

const ActiveLink: React.FC<LinkProps> = ({ children, ...props }) => {
  const { pathname } = useRouter()
  let className = children!.props.className || ''
  const _defaultClass = `${className} text-gray-100`

  if (pathname === props.href) {
    className = `${className} ${props.activeclass}`
  } else {
    className = _defaultClass
  }

  return <Link {...props}>{React.cloneElement(children, { className })}</Link>
}

export default ActiveLink
