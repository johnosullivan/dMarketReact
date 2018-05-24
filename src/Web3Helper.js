import Web3 from 'web3';

class Web3Helper {

  constructor() {

    this.FileManagerABI = [{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"files","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ftype","type":"string"},{"name":"_hash","type":"string"},{"name":"_chunks","type":"string"},{"name":"_size","type":"uint256"},{"name":"_name","type":"string"}],"name":"addFile","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"file","type":"address"},{"indexed":false,"name":"uploader","type":"address"}],"name":"AddFile","type":"event"}];

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

  waitForReceipt = function(hash, cb) {
    this.web3js.eth.getTransactionReceipt(hash, function (err, receipt) {
    if (err) {
    }

    if (receipt !== null) {
      // Transaction went through
      if (cb) {
        cb(receipt);
      }
    } else {
      // Try again in 1 second
      window.setTimeout(function () {
        this.waitForReceipt(hash, cb);
      }, 1000);
    }
    });
  }

  addedFile = function() {
    console.log("Added data");
    var self = this;
    return new Promise((resolve, reject) => {

    var FMC = self.web3js.eth.contract(self.FileManagerABI);
    var FileManager = FMC.at("0x87b29863d2a22543ba6f839a5aece2715fd938e6");

    console.log(FileManager);

    FileManager.addFile("johniscool", "here","today",122121,"was", { from: "0x901473eE8ac77F0967aD3D0Ac2943d4f27668a7f" }, (err, txHash) => {
        resolve(txHash);
    });


    });
  }



}

export default Web3Helper;
