pragma solidity >=0.4.22 <0.6.0;

import "./Owned.sol";

contract FileContractManager is Owned {
    // Contract struct to hold the address
    struct contractStructure {
        address contractAddress;
    }
    // Mapping to map the name to the address
    mapping (bytes32 => contractStructure) contractMap;
    // Constructor for the contract
    constructor() public {
        owner = msg.sender;
    }
    // Set the address to a name in bytes32 data type
    function setAddress(bytes32 name, address _address) public onlyOwner {
        contractMap[name].contractAddress = _address;
    }
    // Remove the address to a name in bytes32 data type
    function removeContractAddress(bytes32 name) public onlyOwner {
        delete contractMap[name];
    }
    // Get the contract address by bytes32
    function getContractAddress(bytes32 name) public view returns (address) {
        return contractMap[name].contractAddress;
    }
}
