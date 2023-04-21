import axios, { HeadersDefaults } from 'axios'
import { getCookie } from 'cookies-next'

const axiosClient: any = axios.create()

// Replace this with our own backend base URL

type headers = {
  'Content-Type': string
  Accept: string
  Authorization: string
}

axiosClient!.defaults!.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as headers & HeadersDefaults

// Adding Authorization header for all requests

axiosClient.interceptors.request.use(
  (config: any) => {
    const token = getCookie('token') as string
    if (token) {
      // Configure this as per your backend requirements
      config.headers!['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

export default axiosClient
