pragma solidity >=0.4.22 <0.6.0;

import "./Interfaces.sol";
import "./Owned.sol";

contract dMarketSeller is Owned {

    struct Version
    {
        string fileHash;
        string fileKey;
        string version;
    }

    mapping(string => mapping(address => bool)) private hasAccess;
    mapping(string => Version) private fileVersions;
    mapping(string => uint256) private tokenPrice;

    TokenInterface public token;

    constructor(address _fileManagerContractManager) public {
        owner = msg.sender;
        token = TokenInterface(FileContractManagerInterface(_fileManagerContractManager).getContractAddress("token"));
    }

    function addAsset(
        string memory _id,
        string memory _fileHash,
        string memory _fileKey,
        string memory _version,
        uint256 _price
    ) public onlyOwner {
        fileVersions[_id] = Version({
            fileHash: _fileHash,
            fileKey: _fileKey,
            version: _version
        });
        tokenPrice[_id] = _price;
    }

    function getAccessStatus(string memory _id) view public returns (bool) {
        return hasAccess[_id][msg.sender];
    }

    function buy(
        string memory _id
    ) public {
        require(token.transferFrom(msg.sender, address(this), tokenPrice[_id]));
        hasAccess[_id][msg.sender] = true;
    }
}
