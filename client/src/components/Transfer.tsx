import React from "react";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Select } from "antd";
import WalletModel from "../models/Wallet";
import Input from "../controls/Input";
import Button from "../controls/Button";
import wallets from "../models/wallets";
import blockChain from "../models/blockChain";

const { Option } = Select;

const TransferForm = styled.div`
  overflow: hidden;
  button,
  .ant-select {
    margin: 0;
    margin-left: 10px;
  }
`;

const StyledSelect = styled(Select)`
  float: right;
  width: 400px;
  :not(.ant-select-customize-input) .ant-select-selector,
  .ant-select-selector {
    border: none;
    border-radius: 22px;
    width: 100%;
    height: 40px;
    padding: 4px 12px;
  }
  .ant-select-selection-placeholder,
  .ant-select-selection-item {
    font-size: 16px;
    margin-left: 6px;
    color: #475470;
  }
`;

const StyledButton = styled(Button)`
  margin: 40px auto 20px;
  display: block;
  float: right;
  min-width: 200px;
`;

const OptionName = styled.div`
  font-size: 16px;
`;

const OptionAddress = styled.div`
  font-size: 10px;
  font-weight: bold;
`;

type Props = {
  fromWallet: WalletModel;
};

// class Wallets extends React.Component<PropsType, {}> {
@observer
class Transfer extends React.Component<Props> {
  @observable
  sendAmountValue: string = "100";

  @observable
  sendToAddress: string;

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  onChangeAmount = (event: any) => {
    this.sendAmountValue = event.target.value.replace(/[^0-9]+/g, "");
  };

  onClickAmount = (event: any) => {
    event.stopPropagation();
  };

  onSelectAddress = (address: any) => {
    this.sendToAddress = address;
  };

  send = async () => {
    const { fromWallet } = this.props;
    await fromWallet.send(this.sendToAddress, parseInt(this.sendAmountValue));
    wallets.fetch();
    blockChain.fetch();
  };

  renderOptions = (fromWallet: WalletModel) => {
    return wallets.items
      .filter((wallet) => wallet !== fromWallet)
      .map((wallet) => {
        return (
          <Option value={wallet.address}>
            <OptionName>{wallet.name}</OptionName>
            <OptionAddress>{wallet.address}</OptionAddress>
          </Option>
        );
      });
  };

  render() {
    const { fromWallet } = this.props;
    return (
      <TransferForm>
        <StyledButton
          type="primary"
          shape="round"
          size="large"
          onClick={this.send}
          disabled={!this.sendToAddress}
          loading={fromWallet.sending}
        >
          Send{" "}
          <Input
            min={1}
            value={this.sendAmountValue}
            bordered={false}
            onChange={this.onChangeAmount}
            onClick={this.onClickAmount}
            size="large"
          />{" "}
          BTC
        </StyledButton>
        <StyledSelect
          placeholder="Select a wallet address"
          onSelect={this.onSelectAddress}
          value={this.sendToAddress}
        >
          {this.renderOptions(fromWallet)}
        </StyledSelect>
      </TransferForm>
    );
  }
}

export default Transfer;
