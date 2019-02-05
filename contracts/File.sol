pragma solidity >=0.4.22 <0.6.0;

import "./Owner.sol";

contract File is Owned {

    struct Version
    {
        string fileHash;
        string fileKey;
        string version;
    }

    mapping(address => bool) private hasAccess;

    Version[] private versions;

    string private filePublicDetails;

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    constructor(
        string memory _version,
        string memory _fileHash,
        string memory _fileKey,
        string memory _filePublicDetails
    ) public {
        versions.push(Version({
            fileHash: _fileHash,
            fileKey: _fileKey,
            version: _version
        }));

        filePublicDetails = _filePublicDetails;
        owner = msg.sender;
        hasAccess[msg.sender] = true;
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

    function allowAccess(
        address _address
    ) onlyOwner public returns (bool status) {
        hasAccess[_address] = true;
        return hasAccess[_address];
    }

    function removeAccess(
        address _address
    ) onlyOwner public returns (bool status) {
        hasAccess[_address] = false;
        return !hasAccess[_address];
    }

    function getVersionsCount() public view returns (uint256) {
        return versions.length;
    }

    function getVersionName(
        uint256 index
    ) public view returns (string memory) {
        return versions[index].version;
    }

    function getAccessStatus() view public returns (bool) {
        return hasAccess[msg.sender];
    }

    function getPublicDetails() view public returns (
        string memory details
    ) {
        return (filePublicDetails);
    }

    function getData(
        uint256 index
    ) onlyBuyer view public returns (
        address fileOwner,
        string memory hash,
        string memory key
    ) {
        return (
           owner,
           versions[index].fileHash,
           versions[index].fileKey
        );
    }

}
