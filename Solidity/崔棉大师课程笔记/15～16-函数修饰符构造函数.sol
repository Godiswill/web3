// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// Function modifier - reuse code before and / or after function
// Basic, inputs, sandwich

/**
函数修饰符 modifier，是对一个或多个条件控制和操作的抽象，
例如很多函数都有相同的报错控制，可以抽离成一个 modifier
    1. 取一个有意义的名字以便理解
    2. 减少重复报错控制代码，也方便条件控制集中维护
*/

// 15 函数修饰符
contract FunctionModifier {
    bool public paused;
    uint public count;

    function setPause(bool _paused) external {
        paused = _paused;
    }

    modifier whenNotPaused() {
        require(!paused, "paused");
        _; // 函数体执行的位置，可以在条件之前、之中、之后
    }

    function inc() external whenNotPaused {
        // require(!paused, "paused");
        count += 1;
    }

    function dec() external whenNotPaused {
        // require(!paused, "paused");
        count -= 1;
    }

    // 也可以接收函数参数
    modifier cap(uint _x) {
        require(_x < 100, "x >= 100");
        _;
    }

    function incBy(uint x) external whenNotPaused cap(x) {
        count += x;
    }

    // 函数体在 modifier 中间执行
    // 类似三明治
    modifier sandwich() {
        count += 10;
        _; // +1
        count += 2;
    }

    function foo() external sandwich {
        count += 1;
    }
}

// 16 函数构造函数
contract Constructor {
    address public owner;
    uint public x;

    // 同其他语言类似，用来初始化合约状态数据
    constructor(uint _x) {
        owner = msg.sender;
        x = _x;
    }
}
