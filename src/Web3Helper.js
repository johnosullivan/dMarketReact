import Web3 from 'web3';

class Web3Helper {

  constructor() {
    console.log("Web3Helper -> constructor");

    if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
      this.web3js = new window.Web3(window.web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!')
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

  }

  addedFile() {
    console.log("Added data");
    console.log(this.web3js);
  }

}

export default Web3Helper;
