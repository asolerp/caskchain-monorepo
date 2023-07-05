import { useGlobal } from '@providers/global'
import { useWeb3Instance } from 'caskchain-lib/provider/web3'

import { useEffect, useState } from 'react'

const useGetBalance = () => {
  const {
    state: { address },
  } = useGlobal()
  const { web3 } = useWeb3Instance()
  const [balance, setBalance] = useState('...')

  useEffect(() => {
    const getBalance = async () => {
      if (address && web3) {
        try {
          const balance = await web3.eth.getBalance(address)
          setBalance(web3.utils.fromWei(balance))
        } catch (error) {
          console.error(error)
        }
      }
    }
    if (!web3 || !address) return
    getBalance()
  }, [web3, address])

  return {
    balance,
  }
}

export default useGetBalance
