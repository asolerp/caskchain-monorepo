import logger from '../../../presentation/utils/logger'
import { Web3Repository } from './Web3Repository'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as _ from 'lodash'

export class Web3Events extends Web3Repository {
  public subscribedEvents: any = {}

  public subscribeLogEvent(
    contractName: string,
    eventName: string,
    callback?: any
  ) {
    const contracts = this.contracts()

    if (!contracts?.[contractName]) {
      return
    }

    const contract = contracts[contractName]

    const eventJsonInterface = _.find(
      contract._jsonInterface,
      (o) => o.name === eventName && o.type === 'event'
    )

    const options = {
      address: contracts[contractName].options.address,
      topics: [eventJsonInterface?.signature],
    }

    const subscription = this.wsClient()
      .eth.subscribe('logs', options, (error) => {
        if (!error)
          logger.info('Got result from subscription', {
            metadata: {
              service: 'nfts-subscription',
            },
          })
        else
          logger.error('Error from subscription', error, {
            metadata: {
              service: 'nfts-subscription',
            },
          })
      })
      .on('data', (log) => {
        const event = this.client().eth.abi.decodeLog(
          eventJsonInterface?.inputs,
          log.data,
          log.topics.slice(1)
        )
        logger.info(
          'Received event',
          {
            ...event,
            transactionHash: log.transactionHash,
          },
          {
            metadata: {
              service: 'nfts-subscription',
            },
          }
        )
        callback && callback({ ...event, transactionHash: log.transactionHash })
      })

    this.subscribedEvents[eventName] = subscription
    logger.info(
      `Subscribed to event '${eventName}' of contract '${contracts[contractName].options.address}'`,
      {
        metadata: {
          service: 'nfts-subscription',
        },
      }
    )
  }

  public unsubscribeEvent(eventName: string) {
    this.subscribedEvents[eventName].unsubscribe(function (
      error: any,
      success: any
    ) {
      if (success)
        logger.info(`Successfully unsubscribed from event '${eventName}'`, {
          metadata: {
            service: 'nfts-subscription',
          },
        })
    })
  }
}
