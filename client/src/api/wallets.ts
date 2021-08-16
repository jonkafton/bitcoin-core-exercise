import { get, post } from "./http";
import {
  WalletData,
  CreateWalletResponse,
  MineBlocksResponse,
} from "../types/wallets";

export const getWallets = async (): Promise<WalletData[]> => {
  return await get("/wallets");
};

export const createWallet = async (): Promise<CreateWalletResponse> => {
  return await post("/wallet");
};

export const mineBlocks = async (
  address: string,
  count: number
): Promise<MineBlocksResponse> => {
  return await post(`/block-mining`, { address, count });
};

export const sendToAddress = async (
  walletName: string,
  toAddress: string,
  amount: number
): Promise<string> => {
  return await post(`/wallet/${walletName}/send`, { toAddress, amount });
};
