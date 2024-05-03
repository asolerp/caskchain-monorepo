import { BaseLayout } from '@ui'
import Header from '@ui/layout/Header'

import { NextPage } from 'next'

import Spacer from '@ui/common/Spacer'
import { auth } from 'utils/auth'
import ClientOnly from 'components/pages/ClientOnly'

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css'
import { faqGettingStarted } from '../../components/pages/faq/faq'

export const getServerSideProps = (context: any) => auth(context)

const FAQ: NextPage = () => {
  return (
    <ClientOnly>
      <BaseLayout background="bg-black-light">
        <div>
          <Header>
            <h1 className="font-rale font-semibold text-6xl text-cask-chain mb-10">
              <span className="text-white">FAQ</span>
            </h1>
          </Header>
          <Spacer size="xl" />
          <div className="px-32 flex flex-col w-full">
            <h2 className="text-white font-sans text-4xl">Getting Started</h2>
            <Spacer size="md" />
            <Accordion allowZeroExpanded className="w-full">
              {faqGettingStarted.map((item) => (
                <AccordionItem
                  key={item.id}
                  className="border-b-[.5px] border-b-white"
                >
                  <AccordionItemHeading>
                    <AccordionItemButton className="text-white px-4 py-2 rounded-full">
                      <h3 className="text-white font-sans text-xl">
                        {item.question}
                      </h3>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel className="mt-2 mb-6 text-gray-400">
                    {item.answer}
                  </AccordionItemPanel>
                </AccordionItem>
              ))}
            </Accordion>
            <Spacer size="xl" />
            <h2 className="text-white font-sans text-4xl">Buying & Selling</h2>
            <Spacer size="md" />
            <Accordion allowZeroExpanded className="w-full">
              {faqGettingStarted.map((item) => (
                <AccordionItem
                  key={item.id}
                  className="border-b-[.5px] border-b-white"
                >
                  <AccordionItemHeading>
                    <AccordionItemButton className="text-white px-4 py-2 rounded-full">
                      <h3 className="text-white font-sans text-xl">
                        {item.question}
                      </h3>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel className="mt-2 mb-6 text-gray-400">
                    {item.answer}
                  </AccordionItemPanel>
                </AccordionItem>
              ))}
            </Accordion>
            <Spacer size="xl" />
            <h2 className="text-white font-sans text-4xl">Blockchain</h2>
            <Spacer size="md" />
            <Accordion allowZeroExpanded className="w-full">
              {faqGettingStarted.map((item) => (
                <AccordionItem
                  key={item.id}
                  className="border-b-[.5px] border-b-white"
                >
                  <AccordionItemHeading>
                    <AccordionItemButton className="text-white px-4 py-2 rounded-full">
                      <h3 className="text-white font-sans text-xl">
                        {item.question}
                      </h3>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel className="mt-2 mb-6 text-gray-400">
                    {item.answer}
                  </AccordionItemPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </BaseLayout>
    </ClientOnly>
  )
}

export default FAQ
