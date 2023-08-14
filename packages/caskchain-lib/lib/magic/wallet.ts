export const getWalletProvider = async (magic: any) => {
  const { walletType } = await magic.wallet.getInfo();
  return walletType;
};
