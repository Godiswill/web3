// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// mapping
// How to declare a mapping (simple and nested)
// Set get delete
contract Mapping {
    mapping(address => uint) public balances;
    mapping(address => mapping(address => bool)) public isFriend;

    function examples() external {
        balances[msg.sender] = 123;
        uint bal = balances[msg.sender]; // 123
        uint bal2 = balances[address(1)]; // 0

        balances[msg.sender] += 456; // 123 + 456

        delete balances[msg.sender]; // 0

        isFriend[msg.sender][address(this)] = true;
    }
}

// 23 映射迭代
// 借助数组，用数组索引来模拟遍历 mapping
contract IterableMapping {
    mapping(address => uint) public balances;
    mapping(address => bool) public inserted;
    address[] public keys;

    function set(address key, uint val) external {
        balances[key] = val;

        if (!inserted[key]) {
            inserted[key] = true;
            keys.push(key);
        }
    }

    function getSize() external view returns (uint) {
        return keys.length;
    }

    function first() external view returns (uint) {
        return balances[keys[0]];
    }

    function last() external view returns (uint) {
        return balances[keys[keys.length - 1]];
    }

    function get(uint index) external view returns (uint) {
        return balances[keys[index]];
    }
}
