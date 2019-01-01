const DataProvider = {};

const web3 = new window.Web3(window.web3.currentProvider);

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
    const self = this;
    return new Promise(function(resolve, reject) {
      self.fileManager.getMyFilesCount(function(err, data) { 
        if (err) { reject(err); } else { resolve(data['c'][0]); }
      });
    });
};

DataProvider.getMyFilesAt = async (index) => {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.fileManager.getMyFilesAt(index, function(err, data) { 
        if (err) { reject(err); } else { resolve(data); }
      });
    });
};

DataProvider.getFilePublicDetails = async (address) => {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.file.at(address).getPublicDetails(function(err, data) { 
        if (err) { reject(err); } else { resolve(data); }
      });
    });
};

module.exports = {
    DataProvider,
    web3
};