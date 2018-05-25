import Web3 from 'web3';

class Web3Helper {

  constructor() {

    this.FileManagerABI = [{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"files","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ftype","type":"string"},{"name":"_hash","type":"string"},{"name":"_chunks","type":"string"},{"name":"_size","type":"uint256"},{"name":"_name","type":"string"},{"name":"_key","type":"string"}],"name":"addFile","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"file","type":"address"},{"indexed":false,"name":"uploader","type":"address"}],"name":"AddFile","type":"event"}];

    console.log("Web3Helper -> constructor");

    if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
      this.web3js = new window.Web3(window.web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!')
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    this.public_address = this.web3js.eth.defaultAccount;

    this.FileManagerAddress = "0x3149c4a79c962c5c1ec3c8404dcd7ba9800e571f";
  }

  waitForReceipt = function(hash, cb) {
    this.web3js.eth.getTransactionReceipt(hash, function (err, receipt) {
    if (err) { }
    if (receipt !== null) {
      if (cb) { cb(receipt); }
    } else {
      window.setTimeout(function () { this.waitForReceipt(hash, cb); }, 1000);
    }
    });
  }

  addedFile = function(data) {
    console.log("Added data");
    var self = this;
    var file_obj = data;
    return new Promise((resolve, reject) => {

    console.log(file_obj);

    var FMC = self.web3js.eth.contract(self.FileManagerABI);
    var FileManager = FMC.at(self.FileManagerAddress);
    console.log(self.FileManagerAddress);
    console.log(self.public_address);
    console.log(FileManager);

    FileManager.addFile(
      file_obj["type"],
      file_obj["hash"],
      file_obj["chunks"][0],
      file_obj["size"],
      "SomeName",
      file_obj["key"],
    { from: self.public_address }, (err, txHash) => {
        console.log(err);
        resolve(txHash);
    });


    });
  }



}

export default Web3Helper;
