pragma solidity >=0.4.22 <0.6.0;

contract Owned {
    address owner;
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
