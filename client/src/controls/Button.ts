import styled from "styled-components";
import { Button } from "antd";

export default styled(Button)`
  background-color: #dc7c24;
  border-color: #dc7c24;
  font-weight: bold;
  text-shadow: none;
  :hover {
    background-color: #c56b18;
    border-color: #c56b18;
  }
  :active,
  :focus,
  &.ant-btn-primary[disabled],
  &.ant-btn-primary[disabled]:hover,
  &.ant-btn-primary[disabled]:focus,
  &.ant-btn-primary[disabled]:active {
    background-color: #dc7c24;
    border-color: #dc7c24;
    color: #fff;
  }
  margin: 40px auto;
  display: block;
`;
