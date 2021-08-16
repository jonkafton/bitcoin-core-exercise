export type CreateWalletResponse = {
  name: string;
  address: string;
};

export type WalletData = {
  name: string;
  balance: number;
  immatureBalance: number;
  unconfirmedBalance: number;
  txCount: number;
  address: string;
};

export type MineBlocksResponse = string[];
