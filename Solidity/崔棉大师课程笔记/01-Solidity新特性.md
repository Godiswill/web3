# Solidity 8.0 新特性

```
/**
Solidity 0.8
* safe math 有溢出报错
* custom errors 自定义错误
* functions outside contract 函数定义可以在合约之外
* import { symbol1 as alias, symbol2 } from "filename"; 引入文件可以取别名
* salted contract creations / create2 加盐合约创造：新方法 create2
 */
```

## 安全数学
```solidity
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// safe math
contract SafeMath {
    // 获取 uint256 最大值
    function maxUint() public pure returns(uint) {
        return 2**256 - 1;
    }
    // 新特性加了安全检查，溢出会 revert
    function testUnderflow() public pure returns(uint) {
        uint x = 0;
        x--;
        return x;
    }
    // 可以加 unchecked 明确告知编译器不检查，获得到 uint256 最大值
    function testUncheckedUnderflow() public pure returns(uint) {
        uint x = 0;
        unchecked {
            x--;
        }
        return x;
    }
    function multi(uint x, uint y) public pure returns(uint) {
        unchecked {
            return x ** y; // 明确不检查，2**256 == 0，这里溢出返回 0
        }
    }
}

```

漏洞分析： 2018 年最高总值达到 280亿美元的 BEC（Beauty Chain）美链，因为溢出漏洞，导致项目市值归零
```solidity
function batchTransfer(address[] _receivers, uint256 _value) public whenNotPaused returns (bool) { 
    uint cnt = _receivers.length;
    // 漏洞代码：当 cnt == 2，_value == 2**255，amount 溢出变成 0
    uint256 amount = uint256(cnt) * _value; // 如果是 pragma solidity ^0.8; 这里执行会产生溢出 revert
    require(cnt > 0 && cnt <= 20);
    require(_value > 0 && balances[msg.sender] >= amount);
    balances[msg.sender] = balances[msg.sender].sub(amount); // 这里转账者消耗 0 个，可以给其他两个账户转入 2**255 个
    for (uint i = 0; i < cnt; i++) {        
        balances[_receivers[i]] = balances[_receivers[i]].add(_value); // 导致代码凭空产生巨量额度
        Transfer(msg.sender, _receivers[i], _value);
    } 
    return true;
}
```

## custom error
```solidity
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// custom error
// 可以定义在合约外部
// 部署 197271 gas，部署在外部消耗的 gas 一样
error Unauthorized(address caller);

contract VendingMachine {
    address payable owner = payable(msg.sender);

    // 自定义错误，可以节约 gas，也可以传入变量
    // 定义在合约内部
    // error Unauthorized(address caller);

    function widthdraw () public {
        if(msg.sender != owner) {
            // 调用 27242 gas
            // 部署 204360 gas
            // revert("error");
            // 部署 214029 gas
            // revert("error error error error error error error error error");
            // 部署 197271 gas 节省 gas
            revert Unauthorized(msg.sender);
        }
        owner.transfer(address(this).balance);
    }
}
```

## function outside contract
```solidity
// function outside contract
// 函数可以提到合约外部，以前只能通过 library 库类实现
function helper(uint x) pure returns (uint) {
    return x * 2;
}

contract TestHelper {
    function test() external pure returns (uint) {
        return helper(123);
    }
}
```

## import { symbol1 as alias, symbol2 } from "filename";

```
// 避免引入文件的变量名与本文件冲突，可以引入时取别名
import { Unauthorized, helper as help } from "./Sol.sol";

function helper(uint x) pure returns (uint) {

}

contract Import {

}
```

## create2
- 新特性直接 new
```solidity
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract D {
    uint public x;
    constructor(uint a) {
        x = a;
    }
}

contract Create2 {
    function getBytes32(uint salt) external  pure returns (bytes32) {
        return bytes32(salt);
    }

    function getBytecode(uint arg) internal  pure returns (bytes memory bytecode) {
        bytecode = abi.encodePacked(
            type(D).creationCode,
            abi.encode(arg)
        );
    }

    function getAddress(bytes32 salt, uint arg) external view returns (address addr) {
        addr = address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            salt,
            keccak256(getBytecode(arg))
        )))));
    }

    address public deployedAddr;

    function createDSalted(bytes32 salt, uint arg) public {
        D d = new D{salt: salt}(arg);
        deployedAddr = address(d);
    }
}
```

1. 部署合约
1. 调用 getBytes32 例如传入 123，数字生成盐值 0x000000000000000000000000000000000000000000000000000000000000007b
1. 调用 getAddress 传入上面的盐值和 D 合约部署需要的参数，例如 0x000000000000000000000000000000000000000000000000000000000000007b,111
1. 调用 createDSalted，用上面一样的参数
1. 获取 deployedAddr 跟 getAddress 返回值做对比，发现一致

以太坊常规部署合约是用 nonce 值来传入 salt，一般难以预测。现在合约动态部署其他合约可以提前计算出将部署合约的地址。

- 旧版汇编
```solidity
contract Create2 {
    ...
    function createDAssembly(bytes32 _salt, uint arg) public {
        bytes memory _bytecode = getBytecode(arg);
        /*
        create2(v, p, n, s)
        create new contract with code at memory p to p + n
        and send v wei
        and return the new address
        where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p...(p+n)))
            s = big.endian 256-bit value
        */
        address addr;
        assembly {
            addr := create2(
                0, // wei sent with current call
                // Actual code starts after skipping the first 32 bytes
                // add(_bytecode, 0x20);
                add(_bytecode, 32),
                mload(_bytecode), // Load the size of code contained in the first 32 bytes
                _salt // salt from function arguments
            )
            
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        deployedAddr = addr;
    }
}
```