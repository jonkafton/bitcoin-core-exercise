import { get } from "./http";
import { BlockChainInfoResponse } from "../types/blockChain";

export const getBlockChainInfo = async (): Promise<BlockChainInfoResponse> => {
  return await get("/block-chain");
};
