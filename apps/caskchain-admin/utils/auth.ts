import axios from 'axios'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { BASE_URL } from 'pages/api/utils'

export const auth = async (context: any, admin?: boolean) => {
  const { req, res } = context
  const session = getCookie('token', { req, res })
  if (!session) {
    setCookie('clearLocalStorage', 'true', { req, res, maxAge: 60 }) // Expira en 60 segundos
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
        `${BASE_URL}/verifyUser${admin ? '?admin=true' : ''}`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      if (data) {
        return { props: {} }
      } else {
        deleteCookie('token', { req, res })
        setCookie('clearLocalStorage', 'true', { req, res, maxAge: 60 })
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    } catch (err: any) {
      deleteCookie('token', { req, res })
      setCookie('clearLocalStorage', 'true', { req, res, maxAge: 60 })
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  }
}
