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
    mapping (address => address[]) public files;
    //maps all the boughts files to their rightful buyers;
    mapping (address => address[]) public boughtFiles;
    //all the file contract address stored here for indexing
    File[] public allFiles;
    
    //file manager events
    event AddedFile(address seller, address file);
    

    function FileManage() public {  
        owner = msg.sender; 
    }

    function addFile(
        string memory  _ftype, string memory _hash, string memory _chunks, string memory _name, string memory _key, string memory _description
    ) public {
        File file = new File();
        file.set(msg.sender, _ftype, _hash, _chunks, _name, _key, _description);
        files[msg.sender].push(address(file));
        emit AddedFile(msg.sender,address(file));
    }
    
    function buyFile(address file) public payable (
          
    )

}

contract File is Owned {

    mapping(address => bool) public hasAccess;

    string public ftype;
    string public hash;
    string public chucks;
    string public name;
    string public description;
    string public key;

    function set(address _owner, string memory _ftype, string memory _hash, string memory _chunks, string memory _name, string memory _key, string memory _description) public {
        owner = _owner;
        ftype = _ftype;
        hash = _hash;
        name = _name;
        key = _key;
        chucks = _chunks;
        description = _description;
    }

    function allowAccess(address _address) onlyOwner public returns (bool status) {
        hasAccess[_address] = true;
        return hasAccess[_address];
    }

    function removeAccess(address _address) onlyOwner public returns (bool status) {
        hasAccess[_address] = false;
        return !hasAccess[_address];
    }

    function hasAccess() view public returns (bool) {
        return hasAccess[msg.sender];
    }
    
    function getPublicDetails() view public returns (address fileOwner, string memory fileName, string memory fileDescription) {
        return (owner, name, description);
    }

}

