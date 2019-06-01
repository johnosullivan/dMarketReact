const FileContractManager = artifacts.require("../contracts/FileContractManager.sol");
const web3util = require('web3-utils');
const expect = require('expect');

contract("ContractManager", function(accounts) {
    let contract;
    let name = web3util.toHex('owner');

    it("should create a new contract manager", async function() {
       contract = await FileContractManager.deployed({ from: accounts[0] });
    });

    it("should set an address to an contract id (bytes32)", async function() {
      await contract.setAddress(name,accounts[0], { from: accounts[0] });
    });

    it("should get an address to an contract by id (bytes32)", async function() {
      const address = await contract.getContractAddress(name);
      expect(address).toBe(accounts[0]);
    });
});
