export const getMagicProvider = (magic: any) => {
  return (magic.wallet as any).getProvider();
};
