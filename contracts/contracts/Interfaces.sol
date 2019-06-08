pragma solidity >=0.4.22 <0.6.0;

interface FileManagerInterface {
    function addFile(address value) external;
    function removeFile(address value) external;
    function addMyFile(address value, address sender) external;
    function addBoughtFile(address value, address buyer) external;
}

interface TokenInterface {
    function transferFrom(address _from, address _to, uint256 _value) external returns(bool success);
    function transfer(address _to, uint256 _value) external returns (bool success);
}

interface FileContractManagerInterface {
    function getContractAddress(bytes32 name) external returns (address);
}

interface tokenRecipient {
    function receiveApproval(address _from, uint256 _value, address _token, bytes calldata _extraData) external;
}
