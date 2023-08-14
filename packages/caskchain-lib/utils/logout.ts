import { deleteCookie } from "cookies-next";
import { getMagicProvider } from "caskchain-lib";
import axiosClient from "../lib/fetcher/axiosInstance";

// When a user logs out, disconnect with Magic & re-set web3 provider
export const logout = async (setWeb3: any, setUser: any, magic: any) => {
  if (!magic) return;
  if (!setWeb3) return;
  const account = localStorage.getItem("user");
  localStorage.removeItem("user");
  deleteCookie("token");
  deleteCookie("refresh-token");
  await magic.wallet.disconnect();
  const provider = await getMagicProvider(magic);
  setWeb3(provider);
  setUser(null);
  console.log("Successfully disconnected");
  await axiosClient.get(`/api/user/${account}/cleanTokens`);
};
