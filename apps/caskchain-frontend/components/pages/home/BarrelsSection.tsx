import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Spacer from '@ui/common/Spacer'
import BarrelNft from '@ui/ntf/item/BarrelNft'
import React from 'react'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { barrels } from './barrels'

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
      className={`cursor-pointer bg-white w-16 h-16 rounded-full z-50 shadow-2xl absolute ${
        positon === 'left' ? 'left-2' : 'right-2'
      } flex items-center justify-center`}
    >
      {positon === 'left' ? (
        <ArrowLeftIcon className="w-8" />
      ) : (
        <ArrowRightIcon className="w-8" />
      )}
    </div>
  )
}

const BarrelsSection = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white py-20">
      <div className="flex flex-col w-full items-center">
        <h2 className="font-rale font-semibold text-center text-6xl">
          The Best Barrels
        </h2>
        <Spacer size="3xl" />
        <div className="w-full flex flex-row items-center justify-center ">
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
            {barrels.map((barrel, i) => (
              <BarrelNft
                key={i}
                showFavorite={false}
                active={true}
                isMarketPlace={false}
                item={barrel}
              />
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default BarrelsSection
