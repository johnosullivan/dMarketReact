pragma solidity >=0.4.22 <0.6.0;

import "./Owner.sol";

pragma solidity >=0.4.22 <0.6.0;

contract Owned {
    address owner;
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

contract FileManager is Owned {
    //maps all the file contracts to their rightful owners
    mapping (address => address[]) private files;
    //maps all the boughts files to their rightful buyers;
    mapping (address => address[]) private boughtFiles;
    //all the file contract address stored here for indexing
    address[] private allFiles;

    //file manager events
    event AddedFile(address seller, address file);
    event BoughtFile(address buyer, address file);

    function FileManage() public {
        owner = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /*
    * Array My Files Functions
    */

    function getMyFilesCount() public view returns (uint256) {
        return files[msg.sender].length;
    }

    function getMyFilesAt(uint256 index) public view returns (address file) {
        return files[msg.sender][index];
    }

    /*
    * Array Boughts Files Functions
    */

    function getBoughtFilesCount() public view returns (uint256) {
        return boughtFiles[msg.sender].length;
    }

    function getBoughtFilesAt(uint256 index) public view returns (address file) {
        return boughtFiles[msg.sender][index];
    }

    /*
    * Array All Files Functions
    */

    function getAllFilesCount() public view returns (uint256) {
        return allFiles.length;
    }

    function getAllFilesAt(uint256 index) public view returns (address file) {
        return allFiles[index];
    }

    function () external payable { }
}

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

    function removeVersion(
        uint256 index
    ) onlyOwner public {
        delete versions[index];
    }

    function updateVersion(
        uint256 index,
        string memory _fileHash,
        string memory _fileKey
    ) onlyOwner public {
        versions[index].fileHash =_fileHash;
        versions[index].fileKey = _fileKey;
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
