import transakSDK from '@transak/transak-sdk'

const settings: any = {
  apiKey: '69733794-9ee8-4b0c-87d7-da8bb74f7b4e', // Your API Key
  environment: 'STAGING', // STAGING/PRODUCTION
  defaultCryptoCurrency: 'ETH',
  themeColor: '000000', // App theme color
  widgetHeight: '700px',
  widgetWidth: '500px',
}

export function openTransak() {
  const transak = new transakSDK(settings)

  transak.init()

  // To get all the events
  transak.on(transak.ALL_EVENTS, (data) => {
    console.log(data)
  })

  // This will trigger when the user closed the widget
  transak.on('TRANSAK_WIDGET_CLOSE', (eventData) => {
    console.log(eventData)
    transak.close()
  })

  // This will trigger when the user marks payment is made.
  transak.on('TRANSAK_ORDER_SUCCESSFUL', (orderData) => {
    console.log(orderData)
    window.alert('Payment Success')
    transak.close()
  })
}
