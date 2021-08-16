import { observable, makeObservable, action, computed } from "mobx";
import { getBlockChainInfo } from "../api/blockChain";

class Blockchain {
  @observable
  fetched: boolean = false;

  @observable
  chain: string;

  @observable
  blocks: number;

  @observable
  headers: number;

  @observable
  bestBlockHash: string;

  @observable
  difficulty: number;

  @observable
  medianTime: number;

  @observable
  verificationProgress: number;

  @observable
  chainWork: string;

  constructor() {
    makeObservable(this);
  }

  @computed
  get displayDifficulty() {
    if (!this.difficulty) return "";
    const difficulty = this.difficulty.toString();
    return `${difficulty.substr(0, 7)}e${difficulty.substr(-3)}`;
  }

  @action
  fetch = async () => {
    const data = await getBlockChainInfo();
    this.chain = data.chain;
    this.blocks = data.blocks;
    this.headers = data.headers;
    this.bestBlockHash = data.bestBlockHash;
    this.difficulty = data.difficulty;
    this.medianTime = data.medianTime;
    this.verificationProgress = data.verificationProgress;
    this.chainWork = data.chainWork;
    this.fetched = true;
  };
}

export default new Blockchain();
