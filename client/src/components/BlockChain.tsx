import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import blockChain from "../models/blockChain";

const Container = styled.div`
  width: 60%;
  background-color: #6c7790;
  border-radius: 10px;
  margin: 0 auto 40px;
  overflow: hidden;
  padding: 40px;
  position: relative;
  min-height: 200px;
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

@observer
class Blockchain extends React.Component {
  componentDidMount() {
    blockChain.fetch();
  }

  render() {
    if (!blockChain.fetched) {
      return null;
    }
    return (
      <Container>
        <Name>The Blockchain</Name>
        <Address>{blockChain.chain}</Address>
        <Field>
          Block height <Value>{blockChain.blocks}</Value>
        </Field>
        <Field>
          Headers validated <Value>{blockChain.headers}</Value>
        </Field>
        <Field>
          Best block <Value>{blockChain.bestBlockHash?.substring(0, 10)}</Value>
        </Field>
        <Field>
          Mining difficulty <Value>{blockChain.displayDifficulty}</Value>
        </Field>
        <Field>
          Median time <Value>{blockChain.medianTime}</Value>
        </Field>
        <Field>
          Verification progress <Value>{blockChain.verificationProgress}</Value>
        </Field>
        <Field>
          Chain work <Value>{blockChain.chainWork?.substr(-10)}</Value>
        </Field>
      </Container>
    );
  }
}

export default Blockchain;
