import { useGlobal } from '@providers/global'
import { useWeb3 } from 'caskchain-lib/provider/web3'

import { useEffect } from 'react'
import { balanceAtom } from 'store/accountAtoms'
import { useAtom } from 'jotai'
import { useAuth } from 'components/contexts/AuthContext'

const useGetBalance = () => {
  const {
    state: { address },
  } = useGlobal()
  const { web3 } = useWeb3()
  const { currentUser } = useAuth()
  const [balance, setBalance] = useAtom(balanceAtom)

  useEffect(() => {
    const getBalance = async () => {
      if (address) {
        try {
          const balance = await web3.eth.getBalance(address)
          setBalance(web3.utils.fromWei(balance))
        } catch (error) {
          console.error(error)
        }
      }
    }
    if (currentUser) {
      getBalance()
    }
  }, [address, web3, setBalance, currentUser])

  return {
    balance,
  }
}

export default useGetBalance
