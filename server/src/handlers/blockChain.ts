import { getBlockChainInfo } from "../adaptors/bitcoind";

export const getBlockChain = async () => {
  const data = await getBlockChainInfo();
  return {
    chain: data.chain,
    blocks: data.blocks,
    headers: data.headers,
    bestBlockHash: data.bestblockhash,
    difficulty: data.difficulty,
    medianTime: data.mediantime,
    verificationProgress: data.verificationprogress,
    chainWork: data.chainwork,
  };
};
