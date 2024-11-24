// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// state variables
// global variables
// function modifier
// function
// error handling

// 以上内容均会使用的到的合约

// 17 Ownable
// 例如限制某些只有合约管理员才能执行某些方法
contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }
    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "invalid address");
        owner = newOwner;
    }

    function anyOneCanCall() external {
        // code
    }

    function onlyOwnerCanCall() external onlyOwner {
        // code
    }
}