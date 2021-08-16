export type BlockChainInfoResponse = {
  chain: string;
  blocks: number;
  headers: number;
  bestBlockHash: string;
  difficulty: number;
  medianTime: number;
  verificationProgress: number;
  chainWork: string;
};
