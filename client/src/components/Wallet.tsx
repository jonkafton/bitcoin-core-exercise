import React from "react";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import styled from "styled-components";
import wallets from "../models/wallets";
import WalletModel from "../models/Wallet";
import walletSVG from "../assets/wallet.svg";
import Button from "../controls/Button";
import Input from "../controls/Input";
import Transfer from "./Transfer";
import blockchain from "../models/blockChain";

const Container = styled.div`
  background-color: #6c7790;
  border-radius: 10px;
  margin: 0 auto 40px;
  overflow: hidden;
  padding: 40px;
  position: relative;
`;

const WalletIcon = styled.img`
  width: 120px;
  position: absolute;
  top: 60px;
  left: 40px;
`;

const WalletInfo = styled.div`
  padding-left: 160px;
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const Address = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const Field = styled.div`
  font-size: 24px;
`;

const Value = styled.div`
  float: right;
`;

const Actions = styled.div`
  overflow: hidden;
`;

const StyledButton = styled(Button)`
  margin: 40px auto 20px;
  display: block;
  float: right;
  min-width: 200px;
`;

type Props = {
  wallet: WalletModel;
  index: number;
};

@observer
class Wallet extends React.Component<Props> {
  @observable
  blockCountValue: string = "25";

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    wallets.fetch();
  }

  onChangeBlockCount = (event: any) => {
    this.blockCountValue = event.target.value.replace(/[^0-9]+/g, "");
  };

  onClickBlockCount = (event: any) => {
    event.stopPropagation();
  };

  mineBlocks = async () => {
    const { wallet } = this.props;
    await wallet.mineBlocks(parseInt(this.blockCountValue, 10));
    wallets.fetch();
    blockchain.fetch();
  };

  render() {
    const { wallet } = this.props;
    return (
      <Container>
        <WalletIcon src={walletSVG} />
        <WalletInfo>
          <Name>{wallet.name}</Name>
          <Address>
            Address <Value>{wallet.address}</Value>
          </Address>
          <Field>
            Balance <Value>{wallet.balance} BTC</Value>
          </Field>
          <Field>
            Immature Balance <Value>{wallet.immatureBalance} BTC</Value>
          </Field>
          <Field>
            Unconfirmed Balance <Value>{wallet.unconfirmedBalance} BTC</Value>
          </Field>
          <Field>
            Transaction Count <Value>{wallet.txCount}</Value>
          </Field>
        </WalletInfo>
        <Actions>
          <StyledButton
            type="primary"
            shape="round"
            size="large"
            onClick={this.mineBlocks}
            loading={wallet.mining}
          >
            Mine{" "}
            <Input
              min={1}
              value={this.blockCountValue}
              bordered={false}
              onChange={this.onChangeBlockCount}
              onClick={this.onClickBlockCount}
            />{" "}
            blocks
          </StyledButton>
        </Actions>
        {wallets.items.length > 1 ? <Transfer fromWallet={wallet} /> : null}
      </Container>
    );
  }
}

export default Wallet;
