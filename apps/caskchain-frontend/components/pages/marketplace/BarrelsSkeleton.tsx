import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const BarrelsSkeleton = () => {
  const elements = [1, 2, 3, 4, 5, 6, 7, 8]
  return (
    <>
      {elements.map((_, i) => (
        <Skeleton
          key={i}
          height={450}
          borderRadius="2rem"
          baseColor="#1C1C1C"
          highlightColor="#2C2C2C"
          className="border border-gray-700"
        />
      ))}
    </>
  )
}

export default BarrelsSkeleton
