export type WalletInfo = {
  avoid_reuse: boolean;
  balance: number;
  descriptors: boolean;
  format: string;
  hdseedid: string;
  immature_balance: number;
  keypoololdest: number;
  keypoolsize: number;
  keypoolsize_hd_internal: number;
  paytxfee: number;
  private_keys_enabled: boolean;
  scanning: boolean;
  txcount: number;
  unconfirmed_balance: number;
  walletname: string;
  walletversion: number;
};

export type CreateWalletResponse = {
  name: string;
  warning: string;
};

export type ListReceivedByAddressResponse = {
  address: string;
  amount: number;
  confirmations: number;
  label: string;
  txids: string[];
};
