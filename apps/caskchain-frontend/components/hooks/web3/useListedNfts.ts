import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useQuery } from '@tanstack/react-query'
import { getNfts } from 'pages/api/nfts/getNfts'
import { useWeb3 } from 'caskchain-lib/provider/web3'

export const useListedNfts = () => {
  const [lastDocId, setLastDocId] = useState(null)
  const { nftVendor } = useWeb3()

  const { data, isSuccess } = useQuery({
    queryKey: ['getCasks'],
    queryFn: ({ pageParam }) =>
      getNfts({ pageParam, filters: null, lastDocId, sortBy: 'tokenId' }),
    staleTime: 5 * 1000,
  })

  useEffect(() => {
    if (isSuccess) {
      const lastDocId = data[data.length - 1].id
      setLastDocId(lastDocId)
    }
  }, [isSuccess, data])

  const _nftVendor = nftVendor

  // const burnNft = useCallback(
  //   async (tokenId: number) => {
  //     const result = await _contract?.burn(tokenId)
  //     await toast.promise(result!.wait(), {
  //       pending: 'Processing transaction',
  //       success: 'Nft is been burned!',
  //       error: 'Processing error',
  //     })
  //   },
  //   [_contract]
  // )

  // const buyNftWithEUR = useCallback(
  //   async (tokenId: number, address: string) => {
  //     const res = await axios.post('/create-checkout-session', {
  //       tokenId,
  //       address,
  //       items: [{ price: 'price_1MKVU6KrAZVK1pXgfXCX0eGL', quantity: 1 }],
  //     })
  //     const body = await res.data
  //     window.location.href = body.url
  //   },
  //   []
  // )

  const buyNft = useCallback(
    async (tokenId: number, price: string) => {
      try {
        const result = await _nftVendor?.buyItem(tokenId, {
          value: price.toString(),
        })
        await toast.promise(result!.wait(), {
          pending: 'Processing transaction',
          success: 'Nft is yours! Go to Profile page',
          error: 'Processing error',
        })
      } catch (e: any) {
        if (e.code === -32603) {
          toast.error('🏦 Insufficient funds', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
        }
        console.error(e.message)
      }
    },
    [_nftVendor]
  )

  // const buyNftWithERC20 = useCallback(
  //   async (tokenId: number, erc20Token: string, price: number) => {
  //     try {
  //       const contractAddress = process.env
  //         .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string

  //       const _erc20Contract = erc20Contracts[erc20Token]
  //       await _erc20Contract
  //         .approve(contractAddress, ethers.utils.parseEther(price.toString()))
  //         .then(async () => {
  //           const result = await _contract?.buyNFTWithERC20(
  //             tokenId,
  //             erc20Token
  //           )
  //           await toast.promise(result!.wait(), {
  //             pending: 'Processing transaction',
  //             success: 'Nft is yours! Go to Profile page',
  //             error: 'Processing error',
  //           })
  //         })
  //       // await _erc20Contract.transfer(contractAddress, String(erc20Price))
  //     } catch (e: any) {
  //       if (e.code === -32603) {
  //         toast.error('🏦 Insufficient funds', {
  //           position: 'top-right',
  //           autoClose: 5000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: 'light',
  //         })
  //       }
  //       console.error(e.message)
  //     }
  //   },
  //   [_contract]
  // )

  return {
    // buyNftWithERC20,
    // buyNftWithEUR,
    // burnNft,
    buyNft,
    data: data || [],
  }
}
