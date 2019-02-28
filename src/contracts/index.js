const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inputFile = {
    'Interfaces.sol': fs.readFileSync(__dirname + '/Interfaces.sol', 'UTF-8'),
    'Owned.sol': fs.readFileSync(__dirname + '/Owned.sol', 'UTF-8'),
    'File.sol': fs.readFileSync(__dirname + '/File.sol', 'UTF-8'),
    'FileManager.sol': fs.readFileSync(__dirname + '/FileManager.sol', 'UTF-8'),
    'FileContractManager.sol': fs.readFileSync(__dirname + '/FileContractManager.sol', 'UTF-8')
};

try {
    const { contracts } = solc.compile({sources: inputFile}, 1);
    let data = { };
    
    const File = contracts['File.sol:File'];
    const FileManager = contracts['FileManager.sol:FileManager'];
    const FileContractManager = contracts['FileContractManager.sol:FileContractManager'];

    data['File'] = { bytecode: File.bytecode, interface: JSON.parse(File.interface) }
    data['FileManager'] = { bytecode: FileManager.bytecode, interface: JSON.parse(FileManager.interface) }
    data['FileContractManager'] = { bytecode: FileContractManager.bytecode, interface: JSON.parse(FileContractManager.interface) }

    fs.writeFile(__dirname + '/build/output.json', JSON.stringify(data, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else { }
    }); 
} catch (e) {
    console.log(e);
}
