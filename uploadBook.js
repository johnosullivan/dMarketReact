const fs = require('fs');
const ipfsClient = require('ipfs-http-client');

/*
* Converts the hex to bytes
*/
const hexToBytes = function(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
  bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}
/*
* Converts the bytes to hex
*/
const bytesToHex = function(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
      hex.push((bytes[i] >>> 4).toString(16));
      hex.push((bytes[i] & 0xF).toString(16));
  }
  return hex.join("");
}
/*
[ { path: 'QmZoGySvuyWdsSobwAr2STDJGpFHM13qAwQE52TE5fSzdU',
    hash: 'QmZoGySvuyWdsSobwAr2STDJGpFHM13qAwQE52TE5fSzdU',
    size: 1079154 } ]

    [ { path: 'QmPrAP9xaL6mEBqB8PnvQcsdfa7PRX6pJeqKHniFkYFYdh',
    hash: 'QmPrAP9xaL6mEBqB8PnvQcsdfa7PRX6pJeqKHniFkYFYdh',
    size: 539607 } ]
*/

async function upload() {

    /*const file = await fs.readFileSync('./src/alice.epub');
    const bytes = new Uint8Array(file);
    const hex = bytesToHex(bytes);

    let ipfs = ipfsClient('/ip4/142.93.156.212/tcp/5001');
    let content = ipfs.types.Buffer.from(hex);
    let results = await ipfs.add(content);*/

/*
    const file = await fs.readFileSync('./src/alice.epub');
    const bytes = new Uint8Array(file);

    console.log(bytes[0]);
    console.log(bytes[1]);
    console.log(bytes[2]);

    let ipfs = ipfsClient('/ip4/142.93.156.212/tcp/5001');
    let results = await ipfs.cat('QmPrAP9xaL6mEBqB8PnvQcsdfa7PRX6pJeqKHniFkYFYdh');
    results

    const bytesA = new Uint8Array(results);


    console.log("===========================");
    console.log(bytesA[0]);
    console.log(bytesA[1]);
    console.log(bytesA[2]);
    */

    let ipfs = ipfsClient('/ip4/142.93.156.212/tcp/5001');
    let results = await ipfs.cat('QmPrAP9xaL6mEBqB8PnvQcsdfa7PRX6pJeqKHniFkYFYdh');
    console.log(results);

    var fs = require('fs');
      fs.writeFile("alice2.epub", results, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
}

upload();
