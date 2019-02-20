pragma solidity >=0.4.22 <0.6.0;

import "./Owner.sol";
import "./File.sol";

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
