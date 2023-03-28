// INIT NFT
// const ccNft = await CCNft.deployed();
// const nftVendor = await NftVendor.deployed();
// const nftOffers = await NftOffers.deployed();
// const nftFractionsFactory = await NftFractionsFactory.deployed();
// const tokenVault = await TokenVault.deployed();
// const token = await MockUSDT.deployed("USDT", "USDT", 1000)

// ccNft.setApprovalForAll(nftFractionsFactory.address, true, { from: accounts[0] })
// ccNft.approve(nftVendor.address, 1, { from : accounts[0]} )

// NFT MARKET
// ccNft.mintNFT("https://ivory-worthy-sparrow-388.mypinata.cloud/ipfs/QmRaEHHk53Ra9bmQ1q3LJ4t2UUs1NmGenDa1Vn4Bx7WNW1" , { from: accounts[0] })
// ccNft.mintNFT("https://ivory-worthy-sparrow-388.mypinata.cloud/ipfs/QmSSU68Aqkwi1uWUs9SbppsjEmGyA7k2wjR8LFUpAyjWDQ", { from: accounts[0] })
// ccNft.transferFrom(accounts[0],accounts[1], 1, { from: accounts[0] })
// nftVendor.listItem(1, "8000000000000000000", { from: accounts[0] })

// NFT FRACTIONS
// nftFractionsFactory.getVaultContractByTokenId(1)

// NFT OFFERS
// nftOffers.makeOffer(1, { from: accounts[2], value: "10000000000000000000"})

// NFT BUY
// ccNft.buyNFT(1, { from: accounts[1], value: "5000000000000000" })

// MAKE OFFER
// ccNft.getNftOffer(1)
// ccNft.getBidAddressesByTokenId(1)
// ccNft.makeOffer(1, { from: accounts[2], value: "30000000000000000000"})
// ccNft.withdraw(1, { from: accounts[2]})
// ccNft.acceptOffer(1, { from: accounts[1]})

// USDT TOKEN0x380356BE61447130E4E2ad35472B752F21572a0A
// token.transfer(accounts[1], "500000000000000000000")

// MARKET GETTERS
// ccNft.getAllNFTs()
// ccNft.getAllNftsOnSale()
// ccNft.totalNftOffers()
// ccNft.ownerOf(1)

// VAUTLT
// vault.mint("CC-Fraction-1", "FCASKCHAIN1", ccNft.address, 1, "10000000000000000000", "1780000000000000000", { from: accounts[0] })
// vault.getVaultContract(0)

// TOKEN VAULT
// tokenVault.balanceOf(accounts[0])
