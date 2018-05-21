import ipfsAPI from 'ipfs-api';
import cryptojs from 'crypto-js';
import aesjs from 'aes-js';

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

class DataHelper {

  constructor() {
    // IPFS configs for class
    this.ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});
    this.ipfs_endpoint = "http://localhost:8080/ipfs/";
    // Prototype for chucking in Uint8Array
    Uint8Array.prototype.chunk = function (n) {
      if (!this.length) { return []; }
      return [ this.slice(0,n) ].concat(this.slice(n).chunk(n));
    };
  }

  generateKey = function(size) {
    var key = '';
    for (var i = 0; i < size; i++) {
      key += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return key;
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
  /*
  * Saving the data chunks to IPFS
  */
  savingIPFS = function(index, data, name) {
    var current_index = index;
    var current_data = data;
    var current_name = name;
    var self = this;
    return new Promise((resolve, reject) => {
      var data = new Buffer(current_data);
      const stream = self.ipfs.files.addReadableStream();
      stream.on('data', function (file) {
        var obj = JSON.parse(JSON.stringify(file));
        obj["index"] = current_index;
        resolve(obj);
      });
      stream.write({ path: current_name, content: data });
      stream.end();
    });
  }
  /*
  * Will cut up the encryped data into chuck of length (len)
  */
  chunkString = function(str, len) {
    var size = Math.ceil(str.length / len),
        ret  = new Array(size),
        offset;
    for (var i = 0; i < size; i++) {
        offset = i * len;
        ret[i] = str.substring(offset, offset + len);
    }
    return ret;
  }
  /*
  * Gets the chunk off IPFS
  */
  getChuck = function(index, hash) {
    var current_index = index;
    var current_hash = hash;
    var self = this;
    return new Promise((resolve, reject) => {
      var uri = self.ipfs_endpoint + current_hash;
      self.get(uri, function(response) {
        resolve({ 'index':current_index, 'data':response });
      });
    });
  }
  /*
  * Giving the details from the EthSC the funciton will get fiel chunks decrypt
  */
  getFile = function(file_data_obj) {
    // Gets the file object data
    var file = file_data_obj;
    var self = this;
    return new Promise((resolve, reject) => {
      var promises = [];
      var chunks = file['chunks'];
      var key = file['key'];
      // Gets the chuck data from IPFS
      for (var i = 0; i < chunks.length; i++) {
        var chunk_hash = chunks[i];
        promises.push(self.getChuck(i, chunk_hash));
      }
      Promise.all(promises).then(function(values) {
          var data = "";
          // Reassembles the single chuck
          for (var i = 0; i < values.length; i++) {
              data += self.findIndex(i,values).data;
          }
          // Bytes being decrypted
          var bytes  = cryptojs.AES.decrypt(data, key);
          var bencoding = bytes.toString(cryptojs.enc.Utf8);
          // Resolve the final bytes
          resolve(self.hexToBytes(bencoding));
        });
    });
  }

  findIndex = function(index, array) {
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        if (obj['index'] == index) {
          return obj;
        }
    }
    return "";
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
        console.log(bytes);

        var orhex = self.bytesToHex(bytes);
        var key = self.generateKey(50);

        var endata = cryptojs.AES.encrypt(orhex, key).toString();
        console.log(endata);

        var chunks = self.chunkString(endata, (endata.length / 3));
        var promises = [];

        for (var i = 0; i < chunks.length; i++) {
            var chunk_data = chunks[i];
            var name = "name# " + i;
            promises.push(self.savingIPFS(i, chunk_data, name));
        }
        Promise.all(promises).then(function(values) {
            var chunks = Array.apply(null, Array(values.length)).map(String.prototype.valueOf,"")
            for (var i = 0; i < values.length; i++) {
                var chunk = values[i];
                var index = chunk["index"];
                chunks[index] = chunk["hash"];
            }
            resolve({ 'key':key, 'chunks':chunks });
        });
      }
      reader.readAsArrayBuffer(file);

    });
  }

  ipfsFile = function(hex) {
    var hex_file = hex;
    var self = this;
    return new Promise((resolve, reject) => {
      /*
      var data = new Buffer(hex_file);
      var path = "testing.data";
      const stream = self.ipfs.files.addReadableStream();
      stream.on('data', function (file) { resolve(file); });
      stream.write({ path: path, content: data });
      stream.end();
      */
      resolve("");
    });
  }


}

export default DataHelper;
