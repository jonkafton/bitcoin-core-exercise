import * as dotenv from "dotenv";
import * as path from "path";
import * as express from "express";
import * as morgan from "morgan";
import * as cors from "cors";
import * as bodyParser from "body-parser";

dotenv.config({ path: path.join(__dirname, "../../.env") });

import wrap from "./middleware/asyncWrapper";
import {
  getWallets,
  postWallet,
  postBlockMining,
  postWalletSend,
} from "./handlers/wallets";
import { getBlockChain } from "./handlers/blockChain";

const app = express();

const { PORT, BITCOIN_CORE_HOST } = process.env;

app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json());

app.get("/health", (request, response) => response.send());

app.get("/wallets", wrap(getWallets));
app.post("/wallet", wrap(postWallet));
app.post("/wallet/:walletName/send", wrap(postWalletSend));
app.post("/block-mining", wrap(postBlockMining));
app.get("/block-chain", wrap(getBlockChain));

app.listen(parseInt(PORT), () => {
  console.info(`Using Bitcoin Core JSON-RPC host ${BITCOIN_CORE_HOST}`);
  console.info(`Server started at http://localhost:${PORT}`);
});
