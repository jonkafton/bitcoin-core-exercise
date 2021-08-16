import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Spin } from "antd";
import wallets from "../models/wallets";
import Wallet from "./Wallet";
import WalletModel from "../models/Wallet";
import Button from "../controls/Button";
import blockchain from "../models/blockChain";

const Container = styled.div<{ fresh: boolean }>`
  width: 60%;
  ${({ fresh }) => (fresh ? "background-color: #6c7790;" : "")}
  border-radius: 10px;
  margin: 0 auto 60px;
  overflow: hidden;
  min-height: 200px;
`;

const Message = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  padding: 40px 0 20px;
`;

const StyledButton = styled(Button)`
  margin: 40px auto;
  display: block;
`;

@observer
class Wallets extends React.Component {
  componentDidMount() {
    wallets.fetch();
  }

  createWallet = async () => {
    await wallets.create();
    wallets.fetch();
    blockchain.fetch();
  };

  renderWallet = (wallet: WalletModel, index: number) => {
    return <Wallet wallet={wallet} index={index} />;
  };

  render() {
    return (
      <Spin spinning={wallets.fetching}>
        <Container fresh={!wallets.items?.length}>
          {!wallets.items?.length ? (
            <Message>Welcome! Need somewhere to store your coins?</Message>
          ) : (
            <>
              {wallets.items?.map((item, index) =>
                this.renderWallet(item, index)
              )}
            </>
          )}

          <StyledButton
            type="primary"
            shape="round"
            size="large"
            onClick={this.createWallet}
            loading={wallets.creating}
          >
            Create {wallets.items?.length ? "another" : "a"} wallet
          </StyledButton>
        </Container>
      </Spin>
    );
  }
}

export default Wallets;
