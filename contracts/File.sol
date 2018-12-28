pragma solidity >=0.4.22 <0.6.0;

contract File is Owned {

    mapping(address => bool) public hasAccess;

    string public ftype;
    string public hash;
    string public chucks;
    string public name;
    string public description;
    string public key;
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
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

    function set(
        address _owner, 
        string memory _ftype, 
        string memory _hash, 
        string memory _chunks, 
        string memory _name, 
        string memory _key, 
        string memory _description
    ) public {
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

    function getAccessStatus() view public returns (bool) {
        return hasAccess[msg.sender];
    }
    
    function getPublicDetails() view public returns (
        address fileOwner, 
        string memory fileName, 
        string memory fileDescription
    ) {
        return (owner, name, description);
    }
    
    function getData() onlyBuyer view public returns (
        address fileOwner, 
        string memory fileType, 
        string memory fileHash, 
        string memory fileChunks, 
        string memory fileName, 
        string memory fileKey, 
        string memory fileDescription    
    ) {
        return (
           owner,
           ftype,
           hash,
           chucks,
           name,
           key,
           description
        );
    }

}

