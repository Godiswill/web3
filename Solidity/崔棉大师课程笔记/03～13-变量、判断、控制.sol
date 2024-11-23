// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// 03 数据类型 Data types - values and references
contract ValueTypes {
    bool public b = true;
    uint public u = 123; // uint = uint256 0 to 2**256 - 1
    //        uint8   0 to 2**8 - 1
    //        uint16  0 to 2**16 - 1
    int public i = -123; // int = int256  -2**255 to 2**255 - 1
    //       int128. -2**127 to 2**127 - 1
    int public minInt = type(int).min;
    int public maxInt = type(int).max;
    address public addr = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4; // 以太钱包地址，20字节，40 个 16进制字符表示
    bytes32 public b32 =
        0x7209c1babb20a3d4ef1f22a104af8efb6bfcc38a1c434d584f1828bc314eb90e; // 32字节，64 个 16 进制字符表示，常见交易 hash
}

// 04 函数简介
contract FunctionIntro {
    function add(uint x, uint y) external pure returns (uint) {
        return x + y;
    }

    function sub(uint x, uint y) external pure returns (uint) {
        return x - y;
    }
}

// 05 状态变量
contract StateVariables {
    uint public myUint = 123; // 状态变量，永久存储在区块链中

    function foo() external pure {
        uint notStateVariable = 456; // 局部变量，使用时申请，用完销毁
    }
}

// 06 局部变量
contract LocalVariables {
    // 链上数据定义
    uint public i;
    bool public b;
    address public myAddress;

    function foo() external {
        uint x = 123; // 局部变量
        bool f = false; // 局部变量

        // 更改局部变量，不会影响链上数据
        x += 456;
        f = true;

        // 更改链上数据
        i = 123;
        b = true;
        myAddress = address(1);
    }
}

// 07 全局变量
contract GlobalVariables {
    function globalVars() external view returns (address, uint, uint) {
        // 常见的全局变量，msg，block 可以直接调用其属性
        address sender = msg.sender; // 调用者地址
        uint timestamp = block.timestamp; // 链上时间戳
        uint blockNum = block.number; // 当前区块号

        return (sender, timestamp, blockNum);
    }
}

// 08 只读函数，关键字 view pure
contract ViewAndPureFunctions {
    uint public num;

    // 只读取链上数据，需要用 view
    function viewFunc() external view returns (uint) {
        return num;
    }

    // 纯函数未读写链上数据，使用 pure
    function pureFunc() external pure returns (uint) {
        return 1;
    }

    // 只读取链上数据，需要用 view
    function addToNum(uint x) external view returns (uint) {
        return num + x;
    }

    // 纯函数只使用了局部变量，未读写链上数据，使用 pure
    function add(uint x, uint y) external pure returns (uint) {
        return x + y;
    }
}

// 09 计数器合约
contract Counter {
    uint public count;

    // 写入链上数据的方法不需要添加 view、pure 关键词
    function inc() external {
        count += 1;
    }

    function dec() external {
        count -= 1;
    }
}

// 10 变量默认值
contract DefaultValues {
    bool public b; // false
    uint public u; // 0
    int public i; // 0
    address public a; // 0x0000000000000000000000000000000000000000 上面讲过 20 字节 40 个 0
    bytes32 public b32; // 0x0000000000000000000000000000000000000000000000000000000000000000 32 字节 64 个 0
}

// 11 常量
// 固定不变值，使用常量可以节省 gas
// 虽然下面纯读取中不需要消耗费用，但混合写入方法里会记录在总体 gas 消耗中
contract Constants {
    // execution cost	373 gas
    address public constant MY_ADDRESS =
        0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    uint public constant MY_UINT = 123;
}

contract Var {
    // execution cost	2483 gas
    address public MY_ADDRESS = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
}

// 12 结构控制 if else 三元运算符
contract IfELse {
    function example(uint x) external pure returns (uint) {
        if (x < 10) {
            return 1;
        } else if (x < 20) {
            return 2;
        } else {
            return 3;
        }
    }

    function ternary(uint x) external pure returns (uint) {
        // if (x < 10) {
        //     return 1;
        // }
        // return 2;
        return x < 10 ? 1 : 2;
    }
}

// 13 循环
contract ForAndWhileLoops {
    function loops() external pure {
        for (uint i = 0; i < 10; i++) {
            // code
            if (i == 3) {
                continue;
            }
            // code
            if (i == 5) {
                break;
            }
        }
        uint j = 0;
        while (j < 10) {
            j++;
        }
    }

    // n 不能太大，否则会消耗过多的 gas
    function sum(uint n) external pure returns (uint) {
        uint total;
        for (uint i = 1; i <= n; i++) {
            total += 1;
        }
        return total;
    }
}
