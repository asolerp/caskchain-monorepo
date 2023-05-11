import { useEffect, useCallback } from 'react'

import { useRouter } from 'next/router'
import { logEvent } from 'firebase/analytics'
import { analytics } from '../../../utils/firebase'

const useInitAnalytics = () => {
  const Router = useRouter()
  const onRouteChangeComplete = useCallback((url: string) => {
    const title = url

    if (analytics !== null) {
      logEvent(analytics, 'screen_view', {
        firebase_screen: title,
        firebase_screen_class: title,
      })
    }
  }, [])

  useEffect(() => {
    Router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      Router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])
}

export default useInitAnalytics
