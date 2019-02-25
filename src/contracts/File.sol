pragma solidity ^0.4.25;

import "./Owned.sol";

interface FileManagerInterface {
    function addFile();
}
    
contract File is Owned {
    /*
     * Struct for the managing of different doc version.
     */
    struct Version
    {
        string fileHash;  
        string fileKey;
        string version;
    }
    
    // Mapping for the permission of the addresses who have access to the document
    mapping(address => bool) private hasAccess;

    // Stores all the different version of the document
    Version[] private versions;


    // Stores the ipfs hash with all the public details
    string private filePublicDetails;

    // Gets the balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    FileManagerInterface public called_address;

    function setFileManager(address _addy) public {
        called_address = FileManagerInterface(_addy);
    }

    function makePublic() public {
        called_address.addFile();
    }

    // Constructor of the contract with params for the version first version
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

    // Buys the document and gives access to address buying
    function buy(
        address buyer
    ) public payable {
        hasAccess[buyer] = true;
    }

    // Default external paying
    function () external payable { }

    // Modifier
    modifier onlyBuyer() {
        require(hasAccess[msg.sender]);
        _;
    }

    // To manually allow access to a document
    function allowAccess(
        address _address
    ) onlyOwner public returns (bool status) {
        hasAccess[_address] = true;
        return hasAccess[_address];
    }

    // To manually remove access to a document
    function removeAccess(
        address _address
    ) onlyOwner public returns (bool status) {
        hasAccess[_address] = false;
        return !hasAccess[_address];
    }

    // Remove a version of the document from viewing
    function removeVersion(
        uint256 index
    ) onlyOwner public {
        delete versions[index];
    }

    // Update a current version of the document
    function updateVersion(
        uint256 index,
        string memory _fileHash,
        string memory _fileKey
    ) onlyOwner public {
        versions[index].fileHash =_fileHash;
        versions[index].fileKey = _fileKey;
    }

    // Gets the count of different version
    function getVersionsCount() public view returns (uint256) {
        return versions.length;
    }

    // Gets the version name based on the index
    function getVersionName(
        uint256 index
    ) public view returns (string memory) {
        return versions[index].version;
    }

    // Gets the access status of the current address
    function getAccessStatus() view public returns (bool) {
        return hasAccess[msg.sender];
    }

    // Get the public details of the document
    function getPublicDetails() view public returns (
        string memory details
    ) {
        return (filePublicDetails);
    }

    // Gets the data to decrpyt using the index
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
