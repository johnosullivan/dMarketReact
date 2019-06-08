const dPublishToken = artifacts.require('../contracts/dPublishToken.sol');
const FileContractManager = artifacts.require("../contracts/FileContractManager.sol");
const dMarketSeller = artifacts.require("../contracts/dMarketSeller.sol");


const expect = require('expect');
const web3util = require('web3-utils');

contract('dMarketSeller', function(accounts) {
  let tokenContract;
  let manageContract;
  let sellerContract;

  const buyer = accounts[1];
  const seller = accounts[2];

  const mainAccount = accounts[3];

  it('should create a new mock token contract ', async function() {
    tokenContract = await dPublishToken.new(500000000000, {from: accounts[0]});
  });

  it('should get the balance of the whole contract in account 0', async function() {
    const value = await tokenContract.balanceOf(accounts[0]);
    expect(value.toString()).toBe('500000000000000000000000000000');
  });

  it('should transfer 1000 DAI to buyer', async function() {
    await tokenContract.transfer(buyer, web3util.toWei('2000', 'ether'), {from: accounts[0]});
  });

  it('should get the balance of the buyer should be 1000 DAI', async function() {
    const valueBuyer = await tokenContract.balanceOf(buyer);
    expect(valueBuyer.toString()).toBe('2000000000000000000000');
  });

  it("should create a new contract manager", async function() {
     manageContract = await FileContractManager.new({ from: accounts[0] });
  });

  it("should set an address to an contract token (bytes32)", async function() {
    await manageContract.setAddress(web3util.toHex('token'),tokenContract.address, { from: accounts[0] });
  });

  it("should set an address to an address main (bytes32)", async function() {
    await manageContract.setAddress(web3util.toHex('main'),mainAccount, { from: accounts[0] });
  });

  it("should set an value to 3 fee (bytes32)", async function() {
    await manageContract.setValue(web3util.toHex('fee'),3, { from: accounts[0] });
  });

  it("should get an address to an contract by token (bytes32)", async function() {
    const address = await manageContract.getContractAddress(web3util.toHex('token'));
    expect(address).toBe(tokenContract.address);
  });

  it("should get an address to an contract by token (bytes32)", async function() {
    sellerContract = await dMarketSeller.new(manageContract.address,{ from: accounts[0] });
  });

  it("should add file to dMarketSeller contract", async function() {
    await sellerContract.addAsset(
      'Zs_AX12',
      'fileHash',
      'fileKey',
      'version',
      web3util.toWei('1000', 'ether')
    );
  });

  it("should get an status of file from buyer before buy", async function() {
    const status = await sellerContract.getAccessStatus('Zs_AX12', { from: buyer });
    expect(status).toBe(false);
  });

  /*it("should approve the payment of 1000 DAI", async function() {
    await tokenContract.approve(sellerContract.address, web3util.toWei('1000', 'ether'), { from: buyer });
  });

  it("should be purchase the eBook", async function() {
    await sellerContract.buy('Zs_AX12', { from: buyer });
  });*/

  it("should approve the payment of 1000 DAI and buy", async function() {
    await tokenContract.approveAndCall(sellerContract.address, web3util.toWei('1000', 'ether'),web3util.toHex('Zs_AX12'), { from: buyer });
  });

  it("should get an status of file from buyer after buy", async function() {
    const status = await sellerContract.getAccessStatus('Zs_AX12', { from: buyer });
    expect(status).toBe(true);
  });

  it('should get the balance of the buyer of 1000 DAI', async function() {
    const valueBuyer = await tokenContract.balanceOf(buyer);
    expect(valueBuyer.toString()).toBe('1000000000000000000000');
  });

  it('should get the balance of the sellerContract of 970 DAI', async function() {
    const valueBuyer = await tokenContract.balanceOf(sellerContract.address);
    expect(valueBuyer.toString()).toBe('970000000000000000000');
  });

  it('should get the balance of the main account of 30 DAI', async function() {
    const valueMain = await tokenContract.balanceOf(mainAccount);
    expect(valueMain.toString()).toBe('30000000000000000000');
  });

  it('should get the balance of the main account of 30 DAI', async function() {
    const valueMain = await tokenContract.balanceOf(mainAccount);
    expect(valueMain.toString()).toBe('30000000000000000000');
  });

  it('should get the resource aka eBook', async function() {
    const values = await sellerContract.getResource('Zs_AX12', { from: buyer });
    expect(values.fileHash).toBe('fileHash');
    expect(values.fileKey).toBe('fileKey');
    expect(values.version).toBe('version');
  });
});
