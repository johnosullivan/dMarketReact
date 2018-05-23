pragma solidity ^0.4.19;

contract FileManager {



}

contract Owned {
    address owner;
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    function Owned() public {
        owner = msg.sender;
    }
}

contract File is Owned {

    mapping(address => bool) public hasAccess;

    string public ftype;
    string public hash;
    string public chucks;
    uint256 public size;

    function File(string _ftype, string _hash, string _chunks, uint256 _size) public {
        ftype = _ftype;
        hash = _hash;
        size = _size;
        chucks = _chunks;
    }

    function allowAccess(address _address) onlyOwner public returns (bool status) {
        hasAccess[_address] = true;
        return hasAccess[_address];
    }

    function removeAccess(address _address) onlyOwner public returns (bool status) {
        hasAccess[_address] = false;
        return !hasAccess[_address];
    }

    function getAccess() constant public returns (bool) {
        return hasAccess[msg.sender];
    }

}
