import { useGlobal } from '@providers/global'
import { useWeb3 } from 'caskchain-lib/provider/web3'

import { useEffect } from 'react'
import { balanceAtom } from 'store/accountAtoms'
import { useAtom } from 'jotai'

const useGetBalance = () => {
  const {
    state: { address },
  } = useGlobal()
  const { web3 } = useWeb3()
  const [balance, setBalance] = useAtom(balanceAtom)

  useEffect(() => {
    const getBalance = async () => {
      console.log('[[ADDRESS]]', address)
      if (address) {
        try {
          const balance = await web3.eth.getBalance(address)
          console.log('BALANCE', balance)
          setBalance(web3.utils.fromWei(balance))
        } catch (error) {
          console.error(error)
        }
      }
    }
    getBalance()
  }, [address, web3, setBalance])

  return {
    balance,
  }
}

export default useGetBalance
