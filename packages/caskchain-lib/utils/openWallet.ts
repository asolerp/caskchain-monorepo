import { magic } from "caskchain-lib";

export const openWallet = async () => {
  // after user has already logged in

  if (!magic) return;

  const { walletType } = await magic.wallet.getInfo();

  if (walletType === "magic") {
    magic.wallet
      .showUI()
      .on("disconnect", () => console.log("user disconnected"));
  }
};
