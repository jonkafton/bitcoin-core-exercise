const assert = require("assert").strict;
const axios = require("axios");

const { API_SERVICE_HOST } = process.env;

const API_BASE_URL = `http://${API_SERVICE_HOST}`;

describe("API Service Integration Suite", () => {
  test("Health check responds OK", async () => {
    const response = await axios.get(API_BASE_URL + "/health");
    assert.equal(response.status, 200, "Responded with status 200");
  });

  test("Not found", async () => {
    try {
      await axios.get(API_BASE_URL + "/noexist");
    } catch (error) {
      assert.equal(error.response.status, 404, "Responded with status 404");
    }
  });

  test("No wallets are created", async () => {
    const response = await axios.get(API_BASE_URL + "/wallets");
    assert.equal(response.status, 200, "Responded with status 200");
    assert.equal(response.headers["content-type"], "application/json; charset=utf-8", "Responded with application/json content type");
    assert.ok(Array.isArray(response.data), "Response body is an array");
    assert.equal(response.data.length, 0, "Array has no length");
  });

  test("Block chain is fresh", async () => {
    const response = await axios.get(API_BASE_URL + "/block-chain");
    assert.equal(response.status, 200, "Responded with status 200");
    assert.equal(response.data.chain, "regtest", "Block chain is running regtest mode");
    assert.equal(response.data.blocks, 0, "Validated chain height is zero");
    assert.equal(response.data.headers, 0, "No headers have been validated");
  });

  let wallet1Address;

  test("Create a wallet", async () => {
    const response = await axios.post(API_BASE_URL + "/wallet");
    assert.equal(response.status, 200, "Responded with status 200");
    assert.equal(typeof response.data, "object", "Response body is an object");
    assert.equal(response.data.name, "Wallet 1", "Wallet name is correct");
    assert.equal(typeof response.data.address, "string", "Wallet address is a string");
  });

  test("Get wallet info", async () => {
    const response = await axios.get(API_BASE_URL + "/wallets");
    assert.equal(response.status, 200, "Responded with status 200");
    const wallet = response.data.find((wallet) => wallet.name === "Wallet 1");
    assert.ok(wallet, "Wallet is found");
    wallet1Address = wallet.address;
    assert.equal(wallet.balance, 0, "Wallet balance is zero");
    assert.equal(wallet.immatureBalance, 0, "Wallet immature balance is zero");
    assert.equal(wallet.unconfirmedBalance, 0, "Wallet unconfirmed balance is zero");
    assert.equal(wallet.txCount, 0, "Wallet transaction count is zero");
    assert.equal(wallet.address, wallet1Address, "Wallet address is correct");
  });

  test("Mine some blocks", async () => {
    const response = await axios.post(API_BASE_URL + "/block-mining", {
      address: wallet1Address,
      count: 100,
    });
    assert.equal(response.status, 200, "Responded with status 200");
    assert.ok(Array.isArray(response.data), "Response body is an array");
    assert.equal(response.data.length, 100, "Array has length 100 (transaction IDs)");
  });

  test("Block chain has correct height", async () => {
    const response = await axios.get(API_BASE_URL + "/block-chain");
    assert.equal(response.status, 200, "Responded with status 200");
    assert.equal(response.data.blocks, 100, "Validated chain height is 100");
    assert.equal(response.data.headers, 100, "100 headers have been validated");
  });

  test("Wallet balances is immature", async () => {
    const response = await axios.get(API_BASE_URL + "/wallets");
    assert.equal(response.status, 200, "Responded with status 200");
    const wallet = response.data.find((wallet) => wallet.name === "Wallet 1");
    assert.equal(wallet.balance, 0, "Wallet balance is zero");
    assert.equal(wallet.immatureBalance, 5000, "Wallet immature balance is 5000");
    assert.equal(wallet.unconfirmedBalance, 0, "Wallet unconfirmed balance is zero");
  });

  test("Mine more blocks", async () => {
    const response = await axios.post(API_BASE_URL + "/block-mining", {
      address: wallet1Address,
      count: 100,
    });
    assert.equal(response.status, 200, "Responded with status 200");
  });

  test("Wallet has balance", async () => {
    const response = await axios.get(API_BASE_URL + "/wallets");
    assert.equal(response.status, 200, "Responded with status 200");
    const wallet = response.data.find((wallet) => wallet.name === "Wallet 1");
    assert.equal(wallet.balance, 5000, "Wallet balance is 5000");
    assert.equal(wallet.immatureBalance, 3725, "Wallet immature balance is 3725");
    assert.equal(wallet.unconfirmedBalance, 0, "Wallet unconfirmed balance is zero");
  });

  let wallet2Address;

  test("Create a second wallet", async () => {
    const response = await axios.post(API_BASE_URL + "/wallet");
    assert.equal(response.status, 200, "Responded with status 200");
    assert.equal(response.data.name, "Wallet 2", "Wallet name is correct");
  });

  test("Second wallet exists", async () => {
    const response = await axios.get(API_BASE_URL + "/wallets");
    assert.equal(response.status, 200, "Responded with status 200");
    const wallet = response.data.find((wallet) => wallet.name === "Wallet 2");
    assert.ok(wallet, "Wallet is found");
    wallet2Address = wallet.address;
  });

  test("Send to wallet", async () => {
    const response = await axios.post(API_BASE_URL + "/wallet/Wallet 1/send", {
      toAddress: wallet2Address,
      amount: 1000,
    });
    assert.equal(response.status, 200, "Responded with status 200");
    assert.equal(typeof response.data.transactionId, "string", "Transaction ID is a string");
  });

  test("Sender wallet balance deducted", async () => {
    const response = await axios.get(API_BASE_URL + "/wallets");
    assert.equal(response.status, 200, "Responded with status 200");
    const wallet = response.data.find((wallet) => wallet.name === "Wallet 1");
    assert.equal(wallet.balance, 3999.9997008, "Transfer amount and fees deducted");
  });

  test("Recipient wallet has unconfirmed balance", async () => {
    const response = await axios.get(API_BASE_URL + "/wallets");
    assert.equal(response.status, 200, "Responded with status 200");
    const wallet = response.data.find((wallet) => wallet.name === "Wallet 2");
    assert.equal(wallet.balance, 0, "Wallet balance is zero");
    assert.equal(wallet.immatureBalance, 0, "Wallet immature balance is 5000");
    assert.equal(wallet.unconfirmedBalance, 1000, "Wallet unconfirmed balance is zero");
  });

  test("Mine one more block", async () => {
    const response = await axios.post(API_BASE_URL + "/block-mining", {
      address: wallet1Address,
      count: 1,
    });
    assert.equal(response.status, 200, "Responded with status 200");
  });

  test("Block chain has correct height", async () => {
    const response = await axios.get(API_BASE_URL + "/block-chain");
    assert.equal(response.status, 200, "Responded with status 200");
    assert.equal(response.data.blocks, 201, "Validated chain height is 201");
    assert.equal(response.data.headers, 201, "201 headers have been validated");
  });

  test("Recipient wallet now has confirmed balance", async () => {
    const response = await axios.get(API_BASE_URL + "/wallets");
    assert.equal(response.status, 200, "Responded with status 200");
    const wallet = response.data.find((wallet) => wallet.name === "Wallet 2");
    assert.equal(wallet.balance, 1000, "Wallet balance is zero");
    assert.equal(wallet.immatureBalance, 0, "Wallet immature balance is 5000");
    assert.equal(wallet.unconfirmedBalance, 0, "Wallet unconfirmed balance is zero");
  });

  test("Transfers are rejected if funds insufficient", async () => {
    try {
      const response = await axios.post(API_BASE_URL + "/wallet/Wallet 1/send", {
        toAddress: wallet2Address,
        amount: 5000,
      });
      assert.fail("Request should not succeed");
    } catch (error) {
      assert.equal(error.response.data.message, "Insufficient funds");
    }
  });
});
