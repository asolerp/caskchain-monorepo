import axios from 'axios'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'

import { toast } from 'react-toastify'

export const auth = async (
  context: any,
  role: 'user' | 'admin',
  props?: any
) => {
  const { req, res } = context
  const session = getCookie('token', { req, res })
  if (!session) {
    //If no user, redirect to login page
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } else {
    try {
      // we call the api that verifies the token.
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify?role=${role}`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      // if token was verified we set the state.
      if (data) {
        return { props: props || {} }
      } else {
        // If the token was fraud we first remove it from localStorage and then redirect to "/"
        deleteCookie('token', { req, res })
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          // Logging out the user by removing all the tokens from local
          deleteCookie('token', { req, res })
          deleteCookie('refresh-token', { req, res })
          return {
            redirect: {
              destination: '/?error=access_denied',
              permanent: false,
            },
          }
        }
        // Access Token was expired
        if (err.response.status === 403) {
          const refreshToken = getCookie('refresh-token', { req, res })
          if (refreshToken) {
            try {
              const rs = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/user/refresh?role=${role}`,
                {
                  token: refreshToken,
                }
              )
              const { token } = rs.data
              setCookie('token', token, { req, res })
              return { props: props || {} }
            } catch (_error) {
              toast.error('Session time out. Please login again.')
              // Logging out the user by removing all the tokens from local
              deleteCookie('token', { req, res })
              deleteCookie('refresh-token', { req, res })
              // Redirecting the user to the landing page
              return {
                redirect: {
                  destination: '/',
                  permanent: false,
                },
              }
            }
          } else {
            deleteCookie('token', { req, res })
            // Redirecting the user to the landing page
            return {
              redirect: {
                destination: '/',
                permanent: false,
              },
            }
          }
        }
      }
    }
  }
  return { props: props || {} }
}
