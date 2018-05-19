import ipfsAPI from 'ipfs-api';

class DataHelper {

  constructor() {
    this.ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});
  }

  get = function(uri, callback) {
    // XMLHttpRequest Get Method
    var request = new XMLHttpRequest();
    // Fires once the state of the request changes
    request.onreadystatechange = function() {
        // If the request is of the right code fire the callback
        if (request.readyState == 4 && request.status == 200) { callback(request.responseText); }
    }
    // Sets the param and sends the request
    request.open("GET",uri,true);
    request.send(null);
  }

  hexToBytes = function(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }

  bytesToHex = function(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
  }

  hexingContent = function(file) {
    var packing_file = file;
    var self = this;
    return new Promise((resolve, reject) => {
      // FileReader
      console.log(self);
      var reader = new FileReader();
      // Begins reading the file data
      reader.onload = function() {
        // Gets the bytes of the file
        var bytes = new Uint8Array(reader.result);
        console.log("file_size: ", bytes.length);
        resolve(self.bytesToHex(bytes));
      }

      reader.readAsArrayBuffer(file);

    });
  }

  ipfsFile = function(hex) {
    var hex_file = hex;
    var self = this;
    return new Promise((resolve, reject) => {
      var data = new Buffer(hex_file);
      var path = "testing.data";
      const stream = self.ipfs.files.addReadableStream();
      stream.on('data', function (file) { resolve(file); });
      stream.write({ path: path, content: data });
      stream.end();
    });
  }


}

export default DataHelper;
