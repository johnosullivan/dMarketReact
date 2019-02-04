pragma solidity >=0.4.22 <0.6.0;

import "./Owner.sol";

contract File is Owned {

    mapping(address => bool) public hasAccess;

    string public fileHash;
    string public fileKey;
    string public filePublicDetails;

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    constructor(
        string memory _fileHash,
        string memory _fileKey,
        string memory _filePublicDetails
    ) public {
        fileHash = _fileHash;
        fileKey = _fileKey;
        filePublicDetails = _filePublicDetails;
        owner = msg.sender;
    }

    function buy(
        address buyer
    ) public payable {
        hasAccess[buyer] = true;
    }

    function () external payable { }

    modifier onlyBuyer() {
        require(hasAccess[msg.sender]);
        _;
    }

    function allowAccess(address _address) onlyOwner public returns (bool status) {
        hasAccess[_address] = true;
        return hasAccess[_address];
    }

    function removeAccess(address _address) onlyOwner public returns (bool status) {
        hasAccess[_address] = false;
        return !hasAccess[_address];
    }

    function getAccessStatus() view public returns (bool) {
        return hasAccess[msg.sender];
    }

    function getPublicDetails() view public returns (
        string memory details
    ) {
        return (filePublicDetails);
    }

    function getData() onlyBuyer view public returns (
        address fileOwner,
        string memory hash,
        string memory key
    ) {
        return (
           owner,
           fileHash,
           fileKey
        );
    }

}
