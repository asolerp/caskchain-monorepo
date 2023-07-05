import { magic } from 'lib/magic'
import { useState } from 'react'

export const useOpenWallet = () => {
  const [loading, setLoading] = useState(false)

  const openWallet = async () => {
    setLoading(true)
    try {
      if (!magic) return
      // after user has already logged in
      const { walletType } = await magic.wallet.getInfo()

      if (walletType === 'magic') {
        await magic.wallet.showUI()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    openWallet,
  }
}
