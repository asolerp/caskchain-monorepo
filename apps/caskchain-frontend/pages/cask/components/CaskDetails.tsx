import { Spacer } from 'caskchain-ui'

type CaskDetailsProps = {
  cask: any
}

const CaskDetails: React.FC<CaskDetailsProps> = ({ cask }) => {
  return (
    <section>
      <h2 className="text-5xl font-semibold font-rale text-white border-b border-cask-chain pb-3">
        Details
      </h2>
      <Spacer size="lg" />
      <p className="text-xl text-gray-400">{cask?.data?.meta?.description}</p>
    </section>
  )
}

export default CaskDetails
