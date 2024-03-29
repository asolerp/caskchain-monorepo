import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Spacer from '@ui/common/Spacer'
import React from 'react'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import useBestBarrels from '@hooks/common/useBestBarrels'

import { Nft } from '@_types/nft'
import BarrelOffer from '@ui/ntf/item/BarrelOffer'

type CustomArrowProps = {
  onClick?: () => void
  positon?: 'left' | 'right'
}

const CustomArrow: React.FC<CustomArrowProps> = ({
  onClick,
  positon = 'left',
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white w-10 h-10 lg:w-16 lg:h-16 rounded-full z-50 shadow-2xl absolute ${
        positon === 'left' ? 'left-2' : 'right-2'
      } flex items-center justify-center`}
    >
      {positon === 'left' ? (
        <ArrowLeftIcon className="w-6 lg:w-8" />
      ) : (
        <ArrowRightIcon className="w-6 lg:w-8" />
      )}
    </div>
  )
}

const BarrelsSection = () => {
  const { bestBarrels } = useBestBarrels()

  return (
    <div className="h-full lg:h-screen flex flex-col items-center justify-center bg-black-light py-10 lg:py-20">
      <div className="flex flex-col w-full items-center">
        <h2 className="font-rale text-white text-center lg:text-left font-semibold text-4xl lg:text-5xl">
          The Best Barrels
        </h2>
        <Spacer sm="md" size="3xl" />
        {bestBarrels?.length > 0 && (
          <div className="w-full flex flex-row items-center justify-center px-2 lg:px-0 ">
            <Carousel
              additionalTransfrom={0}
              arrows
              autoPlaySpeed={3000}
              className=""
              containerClass="container"
              dotListClass=""
              draggable
              infinite
              focusOnSelect={false}
              customLeftArrow={<CustomArrow positon="left" />}
              customRightArrow={<CustomArrow positon="right" />}
              itemClass=""
              keyBoardControl
              minimumTouchDrag={80}
              pauseOnHover
              renderArrowsWhenDisabled={false}
              renderButtonGroupOutside={false}
              responsive={{
                desktop: {
                  breakpoint: {
                    max: 3000,
                    min: 1024,
                  },
                  items: 3,
                  partialVisibilityGutter: 40,
                },
                mobile: {
                  breakpoint: {
                    max: 464,
                    min: 0,
                  },
                  items: 1,
                  partialVisibilityGutter: 30,
                },
                tablet: {
                  breakpoint: {
                    max: 1024,
                    min: 464,
                  },
                  items: 2,
                  partialVisibilityGutter: 30,
                },
              }}
              rewind={false}
              rewindWithAnimation={false}
              rtl={false}
              shouldResetAutoplay
              sliderClass=""
              slidesToSlide={1}
              swipeable
            >
              {bestBarrels?.map((barrel: Nft) => (
                <div key={barrel.tokenId} className="mx-2 lg:mx-0">
                  <BarrelOffer item={barrel} />
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  )
}

export default BarrelsSection
