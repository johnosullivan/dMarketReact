const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inputFile = {
    'File.sol': {
        content: fs.readFileSync(__dirname + '/File.sol', 'UTF-8')
    },
    'FileManager.sol': {
        content: fs.readFileSync(__dirname + '/FileManager.sol', 'UTF-8')
    },
    'FileContractManager.sol': {
        content: fs.readFileSync(__dirname + '/FileContractManager.sol', 'UTF-8')
    }
};

var input = {
    language: 'Solidity',
    sources: inputFile,
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}

function findImports (path) {
    if (path === 'Interfaces.sol') {
        return { contents: fs.readFileSync(__dirname + '/Interfaces.sol', 'UTF-8') }
    } 
    if (path === 'Owned.sol') {
        return { contents: fs.readFileSync(__dirname + '/Owned.sol', 'UTF-8') }
    }   
        
    return { error: 'File not found' }
}

let data = { };

function parseDataContracts(name, contracts) {
    const objectData = contracts[name + '.sol'][name];
    const { abi, evm: { bytecode: { object } } } = objectData;
    data[name] = { bytecode: object, interface: abi }
}

try {
    const { contracts } = JSON.parse(solc.compile(JSON.stringify(input), findImports))
    
    parseDataContracts('File', contracts);

    parseDataContracts('FileManager', contracts);

    parseDataContracts('FileContractManager', contracts);

    fs.writeFile(__dirname + '/build/output.json', JSON.stringify(data, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else { }
    }); 
} catch (e) {
    console.log(e);
}
