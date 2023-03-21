import Spacer from '@ui/common/Spacer'
import BarrelNft from '@ui/ntf/item/BarrelNft'
import React from 'react'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { barrels } from './barrels'

const BarrelsSection = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white py-20">
      <div className="flex flex-col w-full items-center">
        <h2 className="font-rale font-semibold text-center text-6xl">
          The Best Barrels
        </h2>
        <Spacer size="3xl" />
        <div className="w-2/3">
          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlaySpeed={3000}
            className=""
            containerClass="container"
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside
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
