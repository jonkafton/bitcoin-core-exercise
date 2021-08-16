import * as express from "express";
import {
  listWallets,
  getWalletInfo,
  createWallet,
  getNewAddress,
  getWalletAddresses,
  generateToAddress,
  sendToAddress,
} from "../adaptors/bitcoind";

export const postWallet = async () => {
  const existing = await getWallets();
  const name = `Wallet ${existing.length + 1}`;
  await createWallet(name);
  const address = await getNewAddress(name);
  return {
    name,
    address,
  };
};

export const getWallets = async () => {
  const walletNames = await listWallets();

  const walletInfo = await Promise.all(
    walletNames.map(async (walletName) => await getWalletInfo(walletName))
  );

  const walletAddresses = await Promise.all(
    walletNames.map(async (walletName) => await getWalletAddresses(walletName))
  );

  return walletInfo.map((info, index) => ({
    name: walletNames[index],
    balance: info.balance,
    immatureBalance: info.immature_balance,
    unconfirmedBalance: info.unconfirmed_balance,
    txCount: info.txcount,
    address: walletAddresses[index]?.[0]?.address,
  }));
};

export const postBlockMining = async (request: express.Request) => {
  const { address, count } = request.body;
  return await generateToAddress(address, count);
};

export const postWalletSend = async (request: express.Request) => {
  const { params, body } = request;
  const { walletName } = params;
  const { toAddress, amount } = body;
  const transactionId = await sendToAddress(walletName, toAddress, amount);
  return { transactionId };
};
