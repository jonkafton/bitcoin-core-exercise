import { observable, makeObservable, computed } from "mobx";
import { message } from "antd";
import { getWallets, createWallet } from "../api/wallets";
import Wallet from "./Wallet";

class Wallets {
  @observable
  fetching: boolean = true;

  @observable
  creating: boolean = false;

  @observable
  items: Wallet[];

  constructor() {
    makeObservable(this);
  }

  @computed
  get totalBalance() {
    return this.items?.reduce((memo, wallet) => memo + wallet.balance, 0);
  }

  @computed
  get totalImmatureBalance() {
    return this.items?.reduce(
      (memo, wallet) => memo + wallet.immatureBalance,
      0
    );
  }

  @computed
  get totalUnconfirmedBalance() {
    return this.items?.reduce(
      (memo, wallet) => memo + wallet.unconfirmedBalance,
      0
    );
  }

  async fetch() {
    this.fetching = true;
    try {
      const results = await getWallets();
      this.items = results.map((data: any) => new Wallet(data));
    } catch (error) {
      message.error({
        content: error.message,
        className: "alert",
      });
    } finally {
      this.fetching = false;
    }
  }

  create = async () => {
    this.creating = true;
    try {
      await createWallet();
    } catch (error) {
      message.error({
        content: error.message,
        className: "alert",
      });
    } finally {
      this.creating = false;
    }
  };
}

export default new Wallets();
