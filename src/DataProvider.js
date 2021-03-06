import { FileManager, File, FileContractManager } from "./contracts/build/output";
import ipfsClient from 'ipfs-http-client';
import randomstring from 'randomstring';
import cryptojs from 'crypto-js';
import axios from 'axios';

import sabi from './static';

const dataProvider = {};

const web3 = new window.Web3(window.ethereum);

const FileContractManagerAddress = "0x645eeceea858ecf492fea5a2d053f9c3fc073361";
const IPFS_URL = 'https://ipfs.io';

const TEST = '0xfbfc6d96c67778a1a14c082c1f72c836ea82feed';

//"4652106660"
//20000000000000000000

const fileContractManager = web3.eth.contract(FileContractManager.interface).at(FileContractManagerAddress);
let fileManager;
let token;

fileContractManager.getContractAddress(web3.toHex("fileManager"), function(err, address) {
  console.log('FileManager:', address);
  fileManager = web3.eth.contract(FileManager.interface).at(address);
});

fileContractManager.getContractAddress(web3.toHex("token"), function(err, address) {
  console.log('Token:', address);
  token = web3.eth.contract(sabi.tokenABI).at(address);
});

const file = web3.eth.contract(File.interface);

dataProvider.FileContractManagerAddress = FileContractManagerAddress;
dataProvider.IPFS_URL = IPFS_URL;

dataProvider.transactionFile = (fileVersion, fileHash, password, hashDetails, price) => {
   const contract = web3.eth.contract(File.interface);

   const contractInstance = contract.new(
     FileContractManagerAddress,
     fileVersion,
     fileHash,
     password,
     hashDetails,
     price,
     {
      data: File.bytecode,
      from: web3.eth.defaultAccount
     }, (err, res) => {
     if (err) {
         console.log(err);
         return;
     }

     console.log(contractInstance);
     console.log(res.transactionHash);

     if (res.address) { console.log('Contract address: ' + res.address); }
   });
};

dataProvider.transactionReceipt = (hash) => {
  return new Promise(function(resolve, reject) {
    dataProvider.waitForReceipt(hash, function(data) {
      if (data) { resolve(data); } else { reject(data); }
    });
  });
};

dataProvider.waitForReceipt = (hash, cb) => {
  web3.eth.getTransactionReceipt(hash, function (err, receipt) {
    if (err) {
      cb(null);
    }
    if (receipt !== null) {
      if (cb) {
        cb(receipt);
      }
    } else {
      window.setTimeout(function () {
        dataProvider.waitForReceipt(hash, cb);
      }, 1000);
    }
  });
}

dataProvider.approve = (address, amount) => {
  return new Promise(function(resolve, reject) {
    token.approve(address, amount, function(err, data) {
      if (err) { reject(err); } else { resolve(data); }
    });
  });
}

dataProvider.buy = (address) => {
  return new Promise(function(resolve, reject) {
    file.at(address).buy(web3.eth.defaultAccount, async function(err, result) {
      if (err) { reject(err); } else { resolve(result); }
    });
  });
}

dataProvider.tokenPrice = (address) => {
  return new Promise(function(resolve, reject) {
    file.at(address).tokenPrice(async function(err, result) {
      if (err) { reject(err); } else { resolve(result); }
    });
  });
}

dataProvider.bytesToHex = (bytes) => {
  for (var hex = [], i = 0; i < bytes.length; i++) {
      hex.push((bytes[i] >>> 4).toString(16));
      hex.push((bytes[i] & 0xF).toString(16));
  }
  return hex.join("");
}

dataProvider.bytesToHex = (bytes) => {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}

dataProvider.hexToBytes = (hex) => {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

dataProvider.getMyFilesCount = async () => {
    return new Promise(function(resolve, reject) {
      fileManager.getMyFilesCount(function(err, data) {
        if (err) { reject(err); } else { resolve(data['c'][0]); }
      });
    });
};

dataProvider.getMyFilesAt = async (index) => {
    return new Promise(function(resolve, reject) {
      fileManager.getMyFilesAt(index, function(err, data) {
        if (err) { reject(err); } else { resolve(data); }
      });
    });
};

dataProvider.getMyFiles = async () => {
    return new Promise(function(resolve, reject) {
      fileManager.getMyFiles(function(err, data) {
        if (err) { reject(err); } else { resolve(data); }
      });
    });
};

dataProvider.getBoughtFiles = async () => {
  return new Promise(function(resolve, reject) {
    fileManager.getBoughtFiles(function(err, data) {
      if (err) { reject(err); } else { resolve(data); }
    });
  });
};

dataProvider.getFilePublicDetails = async (address) => {
    return new Promise(function(resolve, reject) {
      file.at(address).getPublicDetails(async function(err, data) {
        const dataFromHash = await dataProvider.getIPFS(data[0]);
        if (err) { reject(err); } else { resolve({ data: dataFromHash, owner: data[1] }); }
      });
    });
};

dataProvider.getFileBalance = async (address) => {
  return new Promise(function(resolve, reject) {
    file.at(address).getBalance(async function(err, data) {
      if (err) { reject(err); } else { resolve(data); }
    });
  });
};

dataProvider.getData = async (address) => {
  return new Promise(function(resolve, reject) {
    file.at(address).getData(0, async function(err, result) {
      if (err) { reject(err); } else { resolve(result); }
    });
  });
};

dataProvider.getAccessStatus = async (address) => {
  return new Promise(function(resolve, reject) {
    file.at(address).getAccessStatus(async function(err, result) {
      if (err) { reject(err); } else { resolve(result); }
    });
  });
};

dataProvider.addFile = async (file, details) => {
    return new Promise(async function(resolve, reject) {
      const reader = new FileReader();

      const hashObject = await dataProvider.uploadDataIPFS(JSON.stringify(details));
      const hashDetails = hashObject['hash'];

      reader.onload = async function() {
        const password = randomstring.generate();

        const rawData = new Uint8Array(reader.result);
        const hexData = dataProvider.bytesToHex(rawData);
        const encryptData = cryptojs.AES.encrypt(hexData, password).toString();

        const fileHashObject = await dataProvider.uploadDataIPFS(encryptData);
        const fileHash = fileHashObject['hash'];

        resolve({
          hashDetails,
          fileHash,
          password
        });
      }
      reader.readAsArrayBuffer(file);
    });
};

dataProvider.sendTransaction = (data, address) => {
    const transactionData = data;
    const transactionAddress = address;
    return new Promise(function(resolve, reject) {
        web3.eth.sendTransaction({from: web3.currentProvider.selectedAddress , to: transactionAddress, data: transactionData }, function(err, transactionHash) {
          if (err) {
            reject(err);
          } else {
            resolve(transactionHash);
          }
        });
    });
}

dataProvider.uploadDataIPFS = async (data) => {
    let ipfs = ipfsClient('/ip4/142.93.156.212/tcp/5001');
    let content = ipfs.types.Buffer.from(data);
    let results = await ipfs.add(content);
    return results[0];
};

dataProvider.getIPFS = async (hash) => {
    let results = '';
    try {
      const result = await axios.get(dataProvider.IPFS_URL + '/ipfs/' + hash);
      console.log(result);
      if (result.status === 200) {
        results = result.data;
      }
    } catch (e) {
      console.log(e);
    }
    return results;
}

dataProvider.getFile = async (details) => {
    const fileData = await dataProvider.getIPFS(details[1]);
    const decryptbytes  = cryptojs.AES.decrypt(fileData.toString('utf8'), details[2]);
    const encoding = decryptbytes.toString(cryptojs.enc.Utf8);
    const bytes = new Uint8Array(dataProvider.hexToBytes(encoding));
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
};

export default {
    dataProvider,
    web3
};
