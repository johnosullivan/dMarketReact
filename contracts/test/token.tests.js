const dPublishToken = artifacts.require('../contracts/dPublishToken.sol');
const expect = require('expect');

contract('dPublishToken', function(accounts) {
  let contract;

  it('should create a new mock token contract ', async function() {
    contract = await dPublishToken.new(500000000000, {from: accounts[0]});
  });

  it('should get the balance of the whole contract in account 0', async function() {
    const value = await contract.balanceOf(accounts[0]);
    expect(value.toString()).toBe('500000000000000000000000000000');
  });
});
