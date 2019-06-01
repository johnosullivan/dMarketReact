const FileContractManager = artifacts.require("../contracts/FileContractManager.sol");

module.exports = function(deployer) {
	deployer.deploy(FileContractManager);
};
