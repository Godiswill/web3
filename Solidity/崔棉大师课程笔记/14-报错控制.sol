// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// require, assert，revert,
// - gas refund, state updates are reverted
// custom error save gas

/**
合约方法执行发生报错，状态会回滚，gas 会退还
- require：比较常见，参数判断条件和可选的报错字符串信息
- assert：用的较少，参数只能传入条件，不需要错误信息
- revert：抛出一个错误，错误对象可以是：
    1. 错误字符串信息 revert("errMsg") 比较少用
    2. 自定义错误 error MyErr(xxx, yyy, ...);
        revert MyErr(xxx, yyy, ...);
        1. 可以传入变量错误信息很实用
        2. 节约 gas

一般 require 足够用，以下两种场景需要自定义错误：
1. 需要更多动态错误信息，就需要自定义错误了
2. 优化过多的硬编码字符串，节约 gas
*/
contract Err {
    function testRequire(uint i) public pure {
        require(i <= 10, "i > 10");
        // code
    }

    function testRevert(uint i) public pure {
        if (i > 10) {
            revert("i > 10"); // 不常用，代码也不美观
        }
    }

    uint public num = 123;

    function testAssert() public view {
        assert(num == 123); // 不常用，没有错误信息
    }

    function foo(uint i) public {
        num += 1;
        require(i < 10); // 不常用，省略了错误信息
    }

    error MyErr(address caller, uint i);

    function testCustomErr(uint i) public view {
        // require(i <= 10, "very long error message balabalabalabala...");
        if (i > 10) {
            revert MyErr(msg.sender, i); // 需要动态信息
        }
    }
}
