import axios from "axios";
import { HttpError } from "http-errors-enhanced";
import {
  WalletInfo,
  CreateWalletResponse,
  ListReceivedByAddressResponse,
} from "../types/wallets";
import { BlockChainInfoResponse } from "../types/blockChain";

const { RPC_USER, RPC_PASSWORD, BITCOIN_CORE_HOST } = process.env;

const BASE_URL = `http://${RPC_USER}:${RPC_PASSWORD}@${BITCOIN_CORE_HOST}`;

axios.interceptors.request.use((request) => {
  console.info(
    "[x] Bitcoin Core JSON-RPC",
    request.data.method,
    request.data.params || ""
  );
  return request;
});

axios.interceptors.response.use((response) => {
  const config = JSON.parse(response.config.data);
  console.info(
    "[.] Bitcoin Core JSON-RPC",
    config.method,
    response.status,
    response.statusText
  );
  return response;
});

const request = async (method: string, params?: Array<any>): Promise<any> => {
  try {
    const { data } = await axios.post(BASE_URL, {
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    });

    return data.result;
  } catch (error) {
    const { response } = error;
    if (!response) {
      throw new HttpError(500, "No response from bitcoind JSON-RPC");
    }
    const { status, data } = error.response;
    console.error("Error response from bitcoind JSON-RPC", status, data);
    throw new HttpError(status, data?.error?.message || "Error from bitcoind");
  }
};

const requestForWallet = async (
  walletName: string,
  method: string,
  params?: Array<any>
): Promise<any> => {
  try {
    const { data } = await axios.post(`${BASE_URL}/wallet/${walletName}`, {
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    });

    return data.result;
  } catch (error) {
    const { response } = error;
    if (!response) {
      throw new HttpError(500, "No response from bitcoind JSON-RPC");
    }
    const { status, data } = error.response;
    console.error("Error response from bitcoind JSON-RPC", status, data);
    throw new HttpError(status, data?.error?.message || "Error from bitcoind");
  }
};

export const listWallets = async (): Promise<string[]> => {
  return await request("listwallets");
};

export const getWalletInfo = async (
  walletName: string
): Promise<WalletInfo> => {
  return await requestForWallet(walletName, "getwalletinfo");
};

export const createWallet = async (
  walletName: string
): Promise<CreateWalletResponse> => {
  return await request("createwallet", [walletName]);
};

export const getNewAddress = async (walletName: string): Promise<string> => {
  return await requestForWallet(walletName, "getnewaddress");
};

export const getWalletAddresses = async (
  walletName: string
): Promise<ListReceivedByAddressResponse[]> => {
  return await requestForWallet(walletName, "listreceivedbyaddress", [0, true]);
};

export const generateToAddress = async (
  address: string,
  count: number
): Promise<any> => {
  return await request("generatetoaddress", [count, address]);
};

export const sendToAddress = async (
  walletName: string,
  toAddress: string,
  amount: number
): Promise<string> => {
  return await requestForWallet(walletName, "sendtoaddress", [
    toAddress,
    amount,
  ]);
};

export const getBlockChainInfo = async (): Promise<BlockChainInfoResponse> => {
  return await request("getblockchaininfo");
};
