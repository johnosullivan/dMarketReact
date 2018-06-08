const fs = require('fs');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

var FileManagerABI = [{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"files","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ftype","type":"string"},{"name":"_hash","type":"string"},{"name":"_chunks","type":"string"},{"name":"_size","type":"uint256"},{"name":"_name","type":"string"},{"name":"_key","type":"string"},{"name":"_description","type":"string"}],"name":"addFile","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"file","type":"address"},{"indexed":false,"name":"uploader","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"description","type":"string"}],"name":"AddFile","type":"event"}];

var FileABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"key","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"description","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"chucks","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"removeAccess","outputs":[{"name":"status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hasAccess","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"allowAccess","outputs":[{"name":"status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAccess","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ftype","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_owner","type":"address"},{"name":"_ftype","type":"string"},{"name":"_hash","type":"string"},{"name":"_chunks","type":"string"},{"name":"_name","type":"string"},{"name":"_key","type":"string"},{"name":"_size","type":"uint256"},{"name":"_description","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

var web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var FMC = web3js.eth.contract(FileManagerABI);
var FC = web3js.eth.contract(FileABI);

var FileManager = FMC.at("0xf328562506f371c7f5465df925d1a8605bcee297");

var AddFile = FileManager.AddFile();
AddFile.watch(function(error, result){

  console.log("AddFile", result);
  var current_file = FC.at(result['args'].file);
  //console.log(current_file);

});
