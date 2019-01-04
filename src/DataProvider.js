import abi from './abi.json';

import ipfsClient from 'ipfs-http-client';
import randomstring from 'randomstring';
import cryptojs from 'crypto-js';
import aesjs from 'aes-js';
import { sha256, sha224 } from 'js-sha256';
import { or } from 'ip';

const DataProvider = {};

const web3 = new window.Web3(window.web3.currentProvider);
const fileManager = web3.eth.contract(abi.filemanager).at('0x05da3337fe64ff1c99819dddaf1f159e53862e0e');
const file = web3.eth.contract(abi.file);

DataProvider.bytesToHex = (bytes) => {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}

DataProvider.hexToBytes = (hex) => {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

DataProvider.getMyFilesCount = async () => {
    return new Promise(function(resolve, reject) {
      fileManager.getMyFilesCount(function(err, data) { 
        if (err) { reject(err); } else { resolve(data['c'][0]); }
      });
    });
};

DataProvider.getMyFilesAt = async (index) => {
    return new Promise(function(resolve, reject) {
      fileManager.getMyFilesAt(index, function(err, data) { 
        if (err) { reject(err); } else { resolve(data); }
      });
    });
};

DataProvider.getMyFiles = async () => {
    const myFilesCount = await DataProvider.getMyFilesCount();
    let myFiles = [];

    for (const index of Array(myFilesCount).keys()) {
      const fileAddress = await DataProvider.getMyFilesAt(index);
      const filePublicDetails = await DataProvider.getFilePublicDetails(fileAddress);
      myFiles.push({
        fileAddress,
        filePublicDetails
      });
    }

    return myFiles;
};

DataProvider.getFilePublicDetails = async (address) => {
    return new Promise(function(resolve, reject) {
      file.at(address).getPublicDetails(function(err, data) { 
        if (err) { reject(err); } else { resolve(data); }
      });
    });
};

DataProvider.addFile = async (file, details) => {
  const reader = new FileReader();

  const hashObject = await DataProvider.uploadDataIPFS(JSON.stringify(details));
  const hash = hashObject['hash'];

  console.log('Details: ', hash);

  reader.onload = async function() {
    const password = randomstring.generate();

    const rawData = new Uint8Array(reader.result);
    const hexData = DataProvider.bytesToHex(rawData);
    const encryptData = cryptojs.AES.encrypt(hexData, password).toString();

    const fileHashObject = await DataProvider.uploadDataIPFS(encryptData);
    const fileHash = fileHashObject['hash'];
    
    console.log('File: ', fileHash);
  }
  reader.readAsArrayBuffer(file);
};

DataProvider.sendTransaction = (data, address) => {
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

DataProvider.uploadDataIPFS = async (data) => {
    let ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
    let content = ipfs.types.Buffer.from(data);
    let results = await ipfs.add(content);
    return results[0]; 
};

export default {
    DataProvider,
    web3
};