export const connectWithMagic = async (magic: any) => {
  if (!magic) return;
  const result = magic.wallet.connectWithUI();
  return result;
};
