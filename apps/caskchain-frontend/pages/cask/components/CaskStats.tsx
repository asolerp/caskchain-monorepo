import { Spacer } from 'caskchain-ui'

type CaskStatsProps = {
  data: any
}

const CaskStats: React.FC<CaskStatsProps> = ({ data }) => {
  return (
    <section>
      <div className="flex flex-col justify-center">
        <h2 className="text-5xl font-semibold font-rale text-white border-b border-cask-chain pb-3">
          Stats
        </h2>
        <div className="grid grid-cols-4 gap-4 mt-6 space-y-2">
          {data &&
            Object.entries(data?.meta?.attributes)?.map(([key, value]: any) => (
              <div key={key} className="">
                <dt className="text-lg font-medium text-gray-400">
                  {key.toUpperCase()}
                </dt>
                <Spacer size="xs" />
                <dd className=" text-lg font-sans text-cask-chain text-left w-3/4">
                  {value}
                </dd>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default CaskStats
