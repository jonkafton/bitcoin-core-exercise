import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import wallets from "../models/wallets";
import infoSVG from "../assets/info.svg";

const Container = styled.div`
  background-color: #6c7790;
  border-radius: 10px;
  margin: 0 auto 40px;
  overflow: hidden;
  padding: 20px;
  width: 60%;
  position: relative;
`;

const StyledLogo = styled.img`
  font-size: 20px;
  width: 50px;
  position: absolute;
  top: 35px;
  left: 35px;
`;

const Message = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 30px 20px 90px;
  text-align: left;
`;

@observer
class Info extends React.Component {
  getMessage = () => {
    const wallet = wallets.items?.[0];

    if (!wallet.immatureBalance && !wallet.balance) {
      return (
        <Message>
          We're running a fresh blockchain Testnet so can quickly mine blocks
          and earn the block reward.
          <br />
          <br />
          Each block requires a significant compute to have been invested in its
          creation to ensure that malicious peers wanting to modify past blocks
          must work harder than honest peers adding new blocks.
          <br />
          <br />
          Each block will earn a block reward 50 BTC - as did the first mined
          genesis block in 2009!
        </Message>
      );
    }

    if (wallet.immatureBalance && !wallet.balance) {
      return (
        <Message>
          We've mined some blocks and generated a coinbase transaction, but we
          can't spend the reward just yet - the balance shows as immature.
          <br />
          <br />
          At least 100 more blocks must be mined to ensure the miner's reward
          isn't spent before the block can be proven.
          <br />
          <br />
          The proof of work is a brute force generation of cryptographic hashes
          until one is produced that is lower than the target threshold, the
          difficulty value.
          <br />
          <br />
          Let's continue mining!
        </Message>
      );
    }

    if (wallets.totalUnconfirmedBalance) {
      return (
        <Message>
          We've initiated a transaction, though can see it shows as unconfirmed
          in the recipient's wallet.
          <br />
          <br />
          We'll need to mine a further block to encapsulate the transaction for
          it to become confirmed.
          <br />
          <br />
          Each network peer maintains the ledger of blocks, with each pointing
          to the previous. It is through this consensus that transactions are
          agreed to be valid.
        </Message>
      );
    }

    if (wallet.balance) {
      return (
        <Message>
          Great! Now we have a balance we may want to spend our hard earned
          coins by sending to another address.
          <br />
          <br />
          {wallets.items.length === 1 ? (
            <>Let's generate another wallet to send to.</>
          ) : (
            <>Note that the transaction fee will also be deducted.</>
          )}
        </Message>
      );
    }
  };

  render() {
    const wallet = wallets.items?.[0];
    if (!wallet || wallet.balance !== wallets.totalBalance) {
      return null;
    }
    return (
      <Container>
        <StyledLogo src={infoSVG} />
        {this.getMessage()}
      </Container>
    );
  }
}

export default Info;
