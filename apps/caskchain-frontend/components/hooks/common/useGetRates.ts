import axios from 'axios'
import { useEffect, useState } from 'react'

const useGetRates = () => {
  const [rates, setRates] = useState([])

  useEffect(() => {
    const getRates = async () => {
      try {
        const rates = await axios.get('/api/rates')
        setRates(rates.data)
      } catch (error) {
        console.error(error)
      }
    }

    getRates()
  }, [])

  return {
    rates,
  }
}

export default useGetRates
