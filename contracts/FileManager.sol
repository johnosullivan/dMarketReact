pragma solidity ^0.4.19;

contract Owned {
    address owner;
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    function Owned() public {

    }
}

contract FileManager is Owned {

    mapping (address => address[]) public files;

    event AddFile(address file, address uploader);

    function FileManager() public {
        owner = msg.sender;
    }

    function addFile(
        string _ftype, string _hash, string _chunks, uint256 _size, string _name, string _key
    ) public {
        address c_file = new File(msg.sender, _ftype, _hash, _chunks, _name, _key, _size);
        files[msg.sender].push(c_file);
        AddFile(c_file,msg.sender);
    }

}

contract File is Owned {

    mapping(address => bool) public hasAccess;

    string public ftype;
    string public hash;
    string public chucks;
    string public name;
    string public key;
    uint256 public size;

    function File(address _owner, string _ftype, string _hash, string _chunks, string _name, string _key,uint256 _size) public {
        owner = _owner;
        ftype = _ftype;
        hash = _hash;
        size = _size;
        name = _name;
        key = _key;
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
