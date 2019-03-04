import { FileManager, File, FileContractManager } from "./contracts/build/output";
import ipfsClient from 'ipfs-http-client';
import randomstring from 'randomstring';
import cryptojs from 'crypto-js';
import axios from 'axios';

const dataProvider = {};

const web3 = new window.Web3(window.web3.currentProvider);

const FileContractManagerAddress = "0xb0f18a0835f2f7bc8c57e17a013f37b9880c5d79";
const IPFS_URL = 'https://ipfs.io';

const fileContractManager = web3.eth.contract(FileContractManager.interface).at(FileContractManagerAddress);
let fileManager;

fileContractManager.getContractAddress(web3.toHex("fileManager"), function(err, data) {
  console.log('FileManager:', data);
  fileManager = web3.eth.contract(FileManager.interface).at(data);
});

const file = web3.eth.contract(File.interface);

dataProvider.FileContractManagerAddress = FileContractManagerAddress;
dataProvider.IPFS_URL = IPFS_URL;

dataProvider.myFiles = () => {
  return new Promise(function(resolve, reject) {
    fileManager.getMyFiles(function(err, data) {
      if (err) { reject(err); } else { resolve(data); }
    });
  });
}

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

     console.log(res.transactionHash);

     if (res.address) { console.log('Contract address: ' + res.address); }
   });
};

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
    const myFilesCount = await dataProvider.getMyFilesCount();
    let myFiles = [];

    for (const index of Array(myFilesCount).keys()) {
      const fileAddress = await dataProvider.getMyFilesAt(index);
      const filePublicDetails = await dataProvider.getFilePublicDetails(fileAddress);
      myFiles.push({
        fileAddress,
        filePublicDetails
      });
    }

    return myFiles;
};

dataProvider.getFilePublicDetails = async (address) => {
    return new Promise(function(resolve, reject) {
      file.at(address).getPublicDetails(async function(err, data) {
        const dataFromHash = await dataProvider.getIPFS(data);
        if (err) { reject(err); } else { resolve(dataFromHash); }
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
      if (result.status == 200) {
        results = result.data;
      }
    } catch (e) { 
      console.log(e);
    }
    return results;
}

export default {
    dataProvider,
    web3
};
