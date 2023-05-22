interface CardProps {
  children: React.ReactNode
  color?: string
  containerClasses?: string
}

const Card: React.FC<CardProps> = ({
  children,
  color = 'bg-green-300',
  containerClasses,
}) => {
  const cardClassName = containerClasses
    ? containerClasses
    : 'items-center rounded-2xl shadow-xl w-[220px] h-fit p-6'

  return (
    <div className={`flex flex-col ${color} ${cardClassName}`}>{children}</div>
  )
}

export default Card
