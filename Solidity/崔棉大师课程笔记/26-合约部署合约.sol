// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// 26 合约部署合约
contract Proxy {
    event Deploy(address);

    // 合约如果需要接受铸币，需要定义回退函数
    fallback() external payable {}

    receive() external payable {}

    // 合约动态部署合约
    function deploy(
        bytes memory _code
    ) external payable returns (address addr) {
        assembly {
            // create(v, p, n);
            // v = amount of ETH to send 发送 ETH 的数量
            // p = pointer in memory to start of code 跳过 bytecode 32个字节
            // n = size of code bytecode 的大小
            // 內联会编中不能使用 msg.value，改用 callvalue()
            addr := create(callvalue(), add(_code, 0x20), mload(_code))
        }
        // 地址不为 0 表示部署成功
        require(addr != address(0), "deploy failed");
        emit Deploy(addr);
    }

    // 调合约方法执行其他合约方法
    // @_target 调用的合约地址
    // @_data 执行方法描述的字符和方法参数签名并编码后的字节码
    function excute(address _target, bytes memory _data) external payable {
        (bool success, ) = _target.call{value: msg.value}(_data);
        require(success, "failed");
    }
}

contract Helper {
    // 获取无参数合约的字节码
    function getByteCode1() external pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract1).creationCode;
        return bytecode;
    }

    // 获取需要传参合约的字节码
    function getBytecode2(uint x, uint y) external pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract2).creationCode;
        return abi.encodePacked(bytecode, abi.encode(x, y));
    }

    // 获取合约方法的字节码，owner 为方法参数
    function getCalldata(address owner) external pure returns (bytes memory) {
        return abi.encodeWithSignature("setOwner(address)", owner);
    }
}

contract TestContract1 {
    // 合约部署当前合约时，owner 会变成 Proxy 合约的地址
    address public owner = msg.sender;

    // 部署后需要，Proxy 合约调用该方法，把 owner 设置为正确的地址
    function setOwner(address _owner) public {
        require(msg.sender == owner, "not owner");
        owner = _owner;
    }
}

contract TestContract2 {
    address public owner = msg.sender;
    uint public value = msg.value;
    uint public x;
    uint public y;

    constructor(uint _x, uint _y) payable {
        x = _x;
        y = _y;
    }
}
