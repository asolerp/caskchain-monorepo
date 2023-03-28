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

// axiosClient.interceptors.response.use(
//   (res) => {
//     return res
//   },
//   async (err) => {
//     const originalConfig = err.config

//     if (err.response) {
//       // Access Token was expired
//       if (err.response.status === 401 && !originalConfig._retry) {
//         originalConfig._retry = true

//         try {
//           const rs = await axios.post('/user/refresh', {
//             headers: {
//               Authorization: localStorage.getItem('refresh-token')!,
//             },
//           })

//           const access = rs.data.data['X-Auth-Token']
//           const refresh = rs.data.data['X-Refresh-Token']

//           localStorage.setItem('token', access)
//           localStorage.setItem('refresh-token', refresh)

//           return axiosClient(originalConfig)
//         } catch (_error) {
//           toast.error('Session time out. Please login again.')
//           // Logging out the user by removing all the tokens from local
//           localStorage.removeItem('token')
//           localStorage.removeItem('refresh-token')
//           // Redirecting the user to the landing page
//           window.location.href = window.location.origin
//           return Promise.reject(_error)
//         }
//       }
//     }

//     return Promise.reject(err)
//   }
// )

export default axiosClient
