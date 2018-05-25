const fs = require('fs');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

var FileManagerABI = [{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"files","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ftype","type":"string"},{"name":"_hash","type":"string"},{"name":"_chunks","type":"string"},{"name":"_size","type":"uint256"},{"name":"_name","type":"string"},{"name":"_key","type":"string"}],"name":"addFile","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"file","type":"address"},{"indexed":false,"name":"uploader","type":"address"}],"name":"AddFile","type":"event"}];

var web3js;

web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


var FMC = web3js.eth.contract(FileManagerABI);
var FileManager = FMC.at("0x3149c4a79c962c5c1ec3c8404dcd7ba9800e571f");

var AddFile = FileManager.AddFile();
AddFile.watch(function(error, result){
  console.log("AddFile", result);


});
