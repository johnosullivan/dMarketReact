import abi from './abi.json';

const DataProvider = {};

const web3 = new window.Web3(window.web3.currentProvider);
const fileManager = web3.eth.contract(abi.filemanager).at('0x97d6ad12e0a15156fbe5f59d2c67a7ebd8ae7f4e');
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

export default {
    DataProvider,
    web3
};