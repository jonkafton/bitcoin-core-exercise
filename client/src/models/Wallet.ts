import { observable, makeObservable } from "mobx";
import { message } from "antd";
import { mineBlocks, sendToAddress } from "../api/wallets";
import { WalletData } from "../types/wallets";

class Wallet {
  @observable
  mining: boolean;

  @observable
  sending: boolean;

  @observable
  name: string;

  @observable
  balance: number;

  @observable
  immatureBalance: number;

  @observable
  unconfirmedBalance: number;

  @observable
  txCount: number;

  @observable
  address: string;

  constructor(data: WalletData) {
    makeObservable(this);
    this.name = data.name;
    this.balance = data.balance;
    this.immatureBalance = data.immatureBalance;
    this.unconfirmedBalance = data.unconfirmedBalance;
    this.txCount = data.txCount;
    this.address = data.address;
  }

  mineBlocks = async (count: number) => {
    const defer = setTimeout(() => (this.mining = true), 1000);
    await mineBlocks(this.address, count);
    clearTimeout(defer);
    this.mining = false;
  };

  send = async (toAddress: string, amount: number) => {
    const defer = setTimeout(() => (this.sending = true), 1000);
    try {
      await sendToAddress(this.name, toAddress, amount);
    } catch (error) {
      message.error({
        content: error.message,
        className: "alert",
      });
    } finally {
      clearTimeout(defer);
      this.sending = false;
    }
  };
}

export default Wallet;
