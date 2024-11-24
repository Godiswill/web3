// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// 18 函数返回
contract FunctionOutputs {
    // 函数左括号前定义 returns
    function returnMany() public pure returns (uint, bool) {
        return (1, true); // 匿名返回，多个返回值用大括号包裹
    }

    function named() public pure returns (uint x, bool b) {
        return (1, true); // 定义变量名返回
    }

    function assigned() public pure returns (uint x, bool b) {
        // 由于 returns 中定义了变量名
        // 在代码中所赋值，代表返回的值
        // 匿名返回，不需要 return
        x = 1;
        b = true;
    }

    function destructionAssigments() public pure {
        // 对返回值进行结构
        // 如果只需要其中一个值，空着逗号分隔即可
        (uint x, bool b) = returnMany();
        (, bool _b) = returnMany();
    }
}
