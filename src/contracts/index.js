const path = require('path');
const fs = require('fs');
const solc = require('solc');

var inputFile = {
    'Owned.sol': fs.readFileSync(__dirname + '/Owned.sol', 'UTF-8'),
    'File.sol': fs.readFileSync(__dirname + '/File.sol', 'UTF-8')
};

try {
    const output = solc.compile({sources: inputFile}, 1);
    fs.writeFile(__dirname + '/build/File.json', JSON.stringify(output, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else { }
    }); 
} catch (e) {
    console.log(e);
}
