import React from "react";
import bitcoinSVG from "./assets/bitcoin.svg";
import Info from "./components/Info";
import Wallets from "./components/Wallets";
import BlockChain from "./components/BlockChain";
import styled from "styled-components";

const Page = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
  overflow: scroll;
  min-width: 1200px;
`;

const BitcoinLogo = styled.img`
  margin: 50px auto;
  display: block;
  width: 120px;
`;

class App extends React.Component {
  render() {
    return (
      <Page>
        <BitcoinLogo src={bitcoinSVG} />
        <Info />
        <Wallets />
        <BlockChain />
      </Page>
    );
  }
}

export default App;
