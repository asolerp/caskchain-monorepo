const { ethers } = require('ethers')

const NftMarket = artifacts.require('NftMarket')
const MockUSDT = artifacts.require('MockUSDT')
const VaultFactory = artifacts.require('VaultFactory')

const TokenVault = require('../public/contracts/TokenVault.json')

contract('NftMarket', (accounts) => {
  let _contract = null
  let _token = null

  let _vault = null
  let _nftPrice = ethers.utils.parseEther('2').toString()
  let _nftUSDTPrice = ethers.utils.parseEther('40').toString()

  const _nftFractionalizedPrice = ethers.utils.parseEther('50').toString()

  let _nftReSellPrice = ethers.utils.parseEther('3').toString()

  const defaultRoyalty = 0.1
  const tokenURI = 'https://test.com'
  const tokenURI2 = 'https://test2.com'

  before(async () => {
    _token = await MockUSDT.new('USDT', 'USDT', 1000)
    _vault = await VaultFactory.new()

    await _token.transfer(accounts[1], ethers.utils.parseUnits('500', 'ether'))
    await _token.transfer(accounts[2], ethers.utils.parseUnits('500', 'ether'))

    _contract = await NftMarket.new()

    await _contract.setApprovalForAll(_vault.address, true, {
      from: accounts[0],
    })

    console.log('NFT MARKET ADDRESS', _contract)
  })

  describe('MintNFT token', () => {
    before(async () => {
      await _contract.mintNFT(
        tokenURI,
        _nftPrice,
        [{ paytoken: _token.address, costvalue: _nftUSDTPrice }],
        { from: accounts[0] }
      )
      //   await _contract.createNftOffer(1, _nftPrice, accounts[0])
      await _contract.mintNFT(
        tokenURI2,
        _nftPrice,
        [{ paytoken: _token.address, costvalue: _nftUSDTPrice }],
        { from: accounts[0] }
      )
      //   await _contract.createNftOffer(2, _nftPrice, accounts[0])
    })

    it('should list two nfts', async () => {
      const nfts = await _contract.getAllNFTs()
      assert.equal(nfts.length, 2, 'There is not two elements in the array')
    })

    it('owner of first token should be account[0]', async () => {
      const owner = await _contract.ownerOf(1)
      const royaltyInfo = await _contract.royaltyInfo(1, _nftPrice)
      assert(owner === accounts[0], 'Owner of token is not mathing address[0]')
      assert.equal(
        royaltyInfo[1].toString(),
        (_nftPrice * defaultRoyalty).toString(),
        'Default percentage is not 1%'
      )
    })

    it('should add erc20token price to a selected nft', async () => {
      const cost = await _contract.getNFTCost(1, _token.address)
      assert.equal(
        _nftUSDTPrice.toString(),
        cost.toString(),
        'NFT prices has not been updated'
      )
    })

    it('first token should point to the correct tokenURI', async () => {
      const actualTokenURI = await _contract.tokenURI(1)
      assert.equal(actualTokenURI, tokenURI, 'TokenURI is not correctly set')
    })

    it('should not be possible to create a NFT with used tokenURI', async () => {
      try {
        await _contract.mintNFT(tokenURI, {
          from: accounts[0],
        })
      } catch (error) {
        assert(error, 'NFT was minted with previously used tokenURI')
      }
    })

    it('should have one listed item', async () => {
      const listedItemsCount = await _contract.getNftListedItemsCount()
      assert.equal(
        listedItemsCount.toNumber(),
        2,
        'Listed items count is not 1'
      )
    })

    it('should have created NFT item', async () => {
      const nftItem = await _contract.getNftItem(1)
      assert.equal(nftItem.tokenId, 1, 'Token id is not 1')
      assert.equal(nftItem.price, _nftPrice, 'Nft price is not correct')
      assert.equal(nftItem.creator, accounts[0], 'Creator is not account[0]')
      assert.equal(nftItem.isListed, true, 'Token is not listed')
    })
  })

  describe('Buy NFT token', () => {
    before(async () => {
      await _contract.buyNFT(1, {
        from: accounts[1],
        value: _nftPrice,
      })
    })

    it('should unlist the item', async () => {
      const listedItem = await _contract.getNftItem(1)
      assert.equal(listedItem.isListed, false, 'Item is still listed')
    })

    it('should decrease listed items count', async () => {
      const listedItemsCount = await _contract.getNftListedItemsCount()
      assert.equal(
        listedItemsCount.toNumber(),
        1,
        'Count has not been decrement'
      )
    })

    it('should change the owner', async () => {
      const currentOwner = await _contract.ownerOf(1)
      assert.equal(currentOwner, accounts[1], 'Item is still listed')
    })
  })

  describe('NFT Offers', () => {
    it('nft 1 from accounts[0] should have the default offer after nft is minted', async () => {
      const offer = await _contract.getNftOffer(1)
      assert.equal(offer.nftId, 1, 'The nft does not have the default offer')
    })

    it('should update the highestBid and highestBidder when higher offer is made', async () => {
      let newOffer = ethers.utils.parseEther('3').toString()
      await _contract.makeOffer(1, { from: accounts[2], value: newOffer })
      const offer = await _contract.getNftOffer(1)
      console.log('OFFER', offer)
      assert.equal(
        offer.highestBidder,
        accounts[2],
        'The new offer has not updated the highestBidder'
      )
    })

    it('shold transfer the nft if seller accepts the highestBid', async () => {
      const balanceBeforeAcceptOffer = await web3.eth.getBalance(accounts[1])
      await _contract.acceptOffer(1, { from: accounts[1] })
      const owner = await _contract.ownerOf(1)
      const balanceAfterAcceptOffer = await web3.eth.getBalance(accounts[1])
      assert.equal(owner, accounts[2], 'The nft has not change the owner')
      assert(
        balanceBeforeAcceptOffer.toString() <
          balanceAfterAcceptOffer.toString(),
        'The nft has not change the owner'
      )
    })
  })

  describe('Transfer NFT with royalty pay', () => {
    it('Should transfer NFT and pay royalties when value in transaction', async () => {
      const _transferValue = ethers.utils.parseEther('4').toString()

      await _contract.transferFrom(accounts[2], accounts[1], 1, {
        from: accounts[2],
        values: _transferValue,
      })

      const ownNfts = await _contract.ownerOf(1)

      assert.equal(ownNfts, accounts[1], 'NFT has wrong owner')
    })
  })

  //   describe('Order Bottle', () => {
  //     const tokenURI = 'https://test-extraction.com'
  //     const extractions = 2

  //     it('NFT should update it tokenURI', async () => {
  //       const tokenURIBeforeExtraction = await _contract.tokenURI(1)

  //       await _contract.orderBottle(extractions, 1, tokenURI, {
  //         from: accounts[2],
  //         value: _nftBottleExtractionPrice * extractions,
  //       })
  //       const tokenURIAfterExtraction = await _contract.tokenURI(1)
  //       const extractionsNft = await _contract.getTokenExtractionsByYear(1, 2022)

  //       assert(
  //         tokenURIBeforeExtraction !== tokenURIAfterExtraction,
  //         'TokenURI are the same'
  //       )
  //       assert.equal(extractionsNft, 2, 'Number of extractions are incorrect')
  //     })
  //   })

  //   describe('Buy NFT token with ERC20', () => {
  //     before(async () => {
  //       await _contract.mintNFT(
  //         tokenURI3,
  //         _nftPrice,
  //         [{ paytoken: _token.address, costvalue: _nftUSDTPrice }],
  //         { from: accounts[0] }
  //       )

  //       const nftERC20price = await _contract.getNFTCost(3, _token.address)

  //       console.log('ERC20_COST', nftERC20price.toString())

  //       await _token.approve(_contract.address, nftERC20price, {
  //         from: accounts[1],
  //       })

  //       await _contract.buyNFTWithERC20(1, _token.address, {
  //         from: accounts[1],
  //         value: nftERC20price,
  //       })
  //     })

  //     it('should buy the nft with ERC20', async () => {
  //       const currentOwner = await _contract.ownerOf(1)
  //       assert.equal(currentOwner, accounts[1], 'Owner is not account[1]')
  //     })

  //     it('should have less ERC20 after the buy', async () => {
  //       const balanceBuyer = await _token.balanceOf(accounts[1])
  //       console.log(balanceBuyer.toString(), 'BUYER')
  //       // assert.equal(currentOwner, accounts[1], "Owner is not account[1]");
  //     })
  //   })

  describe('List an NFT to sell', () => {
    before(async () => {
      await _contract.placeNftOnSale(1, _nftReSellPrice, { from: accounts[1] })
    })

    it('should have three listed items', async () => {
      const listedNfts = await _contract.getAllNftsOnSale()
      assert.equal(listedNfts.length, 2, 'Invalid length of tokens')
    })
  })

  describe('Buy NFT from third user', () => {
    it('creator should receive the royalty when is buy it to a user different from', async () => {
      const creatorBalanceBeforeSell = await web3.eth.getBalance(accounts[0])

      await _contract.buyNFT(1, {
        from: accounts[2],
        value: _nftReSellPrice,
      })

      const creatorBalanceAfterSell = await web3.eth.getBalance(accounts[0])

      assert(
        Number(creatorBalanceAfterSell.toString()) >
          Number(creatorBalanceBeforeSell.toString()),
        'Balance of creator is not bigger after the sell'
      )
    })
  })

  describe('Burn Token', () => {
    const tokenURI = 'https://test-json3.com'

    before(async () => {
      await _contract.mintNFT(
        tokenURI,
        _nftPrice,
        [{ paytoken: _token.address, costvalue: _nftUSDTPrice }],
        { from: accounts[0] }
      )
    })

    it('account[0] should have one owned NFT', async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] })
      assert.equal(ownedNfts[0].tokenId, 2, 'Nft has a wrong id')
    })

    it('account[0] should own 1 NFTs', async () => {
      const ownedNftsBeforeBurn = await _contract.getOwnedNfts({
        from: accounts[0],
      })
      assert.equal(
        ownedNftsBeforeBurn.length,
        2,
        'Invalid length of tokens before burn'
      )

      await _contract.burn(3)

      const ownedNftsAfterBurn = await _contract.getOwnedNfts({
        from: accounts[0],
      })
      assert.equal(
        ownedNftsAfterBurn.length,
        1,
        'Invalid length of tokens after burn'
      )
    })
  })

  // FRACTIONALIZE NFT
  describe('Fractionalize NFT', () => {
    const tokenURI = 'https://test-fractionalize.com'

    before(async () => {
      await _contract.mintNFT(
        tokenURI,
        _nftFractionalizedPrice,
        [{ paytoken: _token.address, costvalue: _nftUSDTPrice }],
        { from: accounts[0] }
      )
    })
    it('should lock NFT', async () => {
      console.log('ADDRESS', _contract.address)
      await _vault.mint(
        'CC-Fraction-1',
        'FCASKCHAIN1',
        _contract.address,
        4,
        1000,
        ethers.utils.parseEther('0.5').toString(),
        { from: accounts[0] }
      )

      const newVaultContract = await _vault.vaults(0)
      const vaultContract = new web3.eth.Contract(
        TokenVault.abi,
        newVaultContract,
        { from: accounts[0] }
      )
      console.log('TOKENS', await vaultContract.methods.id().call())
    })
  })
})
