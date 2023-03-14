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
        if (!error) console.log('got result')
        else console.log(error)
      })
      .on('data', (log) => {
        const event = this.client().eth.abi.decodeLog(
          eventJsonInterface?.inputs,
          log.data,
          log.topics.slice(1)
        )
        console.log('EVENTO', event)
        callback && callback(event)
      })

    this.subscribedEvents[eventName] = subscription

    console.log(
      `Subscribed to event '${eventName}' of contract '${contracts[contractName].options.address}' `
    )
  }

  public unsubscribeEvent(eventName: string) {
    this.subscribedEvents[eventName].unsubscribe(function (
      error: any,
      success: any
    ) {
      if (success) console.log('Successfully unsubscribed!')
    })
  }
}
