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
    address public fileManagerContractManager;

    constructor(address _fileManagerContractManager) public {
        owner = msg.sender;
        fileManagerContractManager = _fileManagerContractManager;
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

    function getAccessStatus(string memory _id) view public returns (bool status) {
        return hasAccess[_id][msg.sender];
    }

    function getResource(string memory _id) view public returns (
      string memory fileHash,
      string memory fileKey,
      string memory version
    ) {
        require(hasAccess[_id][msg.sender]);
        return (
          fileVersions[_id].fileHash,
          fileVersions[_id].fileKey,
          fileVersions[_id].version
        );
    }

    function receiveApproval(address _from, uint256 _value, address _token, bytes memory _extraData) public {
        string memory _id = string(_extraData);

        require(tokenPrice[_id] == _value);

        require(TokenInterface(_token).transferFrom(_from, address(this), tokenPrice[_id]));

        hasAccess[_id][_from] = true;

        uint256 rate = FileContractManagerInterface(fileManagerContractManager).getValue("fee");

        uint256 amount = tokenPrice[_id] * rate / 100;

        TokenInterface(_token).transfer(FileContractManagerInterface(fileManagerContractManager).getContractAddress("main"), amount);
    }
}
