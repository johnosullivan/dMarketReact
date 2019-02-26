interface FileManagerInterface {
    function addFile(address value) external;
    function removeFile(address value) external;
}

interface TokenInterface {
    function transferFrom(address _from, address _to, uint256 _value) external returns(bool success);
}

interface FileContractManagerInterface {
    function getContractAddress(bytes32 name) external returns (address);
}