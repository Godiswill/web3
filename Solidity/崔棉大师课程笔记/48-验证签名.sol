// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// 48 验证签名
/*
0. message to sign 验证签名
1. hash(message) hash 消息
2. sign(hash(message), private key) | offchain 链下用私钥对消息的 hash 进行签名
3. ecrecover(hash(message), signature) == signer 链上方法恢复签名，对比签名是否一致
*/
contract VerifySig {
    /// @notice 验证签名
    /// @param  _signer 签名人钱包地址 message 原始信息 _sig 私钥加密后的签名
    function verify(
        address _signer,
        string memory _message,
        bytes memory _sig
    ) external pure returns (bool) {
        // 对消息进行 hash
        bytes32 messageHash = getMessageHash(_message);
        // 链下会加入以太坊标识字符串，对消息的 hash 值进行二次 hash，增强安全性
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recover(ethSignedMessageHash, _sig) == _signer;
    }

    function getMessageHash(
        string memory _message
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_message));
    }

    function getEthSignedMessageHash(
        bytes32 _messageHash
    ) public pure returns (bytes32) {
        // 链下会再进行一次 hash
        // 可能是为了增强安全性，一次 hash 可能被破解
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _messageHash
                )
            );
    }

    function recover(
        bytes32 _ethSignedMessageHash,
        bytes memory _sig
    ) public pure returns (address) {
        (, bytes32 r, bytes32 s, uint8 v) = _split(_sig);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function _split(
        bytes memory _sig
    ) public pure returns (bytes32 size, bytes32 r, bytes32 s, uint8 v) {
        require(_sig.length == 65, "invalid signature length");
        // 签名 65 字节，由 v r s 拼接而成
        // 所以需要反向拆分
        // 只能用內联会编分割
        assembly {
            // _sig 实际在内存中前 32 bytes 表示长度
            // 0x0000000000000000000000000000000000000000000000000000000000000041
            // 即 65
            // 也就是说 32 bytes 后面才是内存中真正存储的数据
            size := mload(_sig)
            // add 跳过表示长度的 32 bytes 位
            // mload 从第 33 bytes 位开始去 32 bytes
            r := mload(add(_sig, 32))
            // 同理，跳过 32 + r的长度 = 64
            s := mload(add(_sig, 64))
            // 同理，跳过 32 + r的长度 + s的长度 = 96
            // byte(x, y) 表示 y 的第 x 位 byte 数据
            // uint8 取第一位即 0
            v := byte(0, mload(add(_sig, 96)))
        }
    }
}

/*
1. 部署合约
2. 在安装了钱包插件的浏览器中打开 console
    1. 输入 ethereum.enable()，弹出钱包授权确认
    2. 点开 Promise 在 PromiseResult 可以看到钱包地址，即 _signer
    3. 调用合约 getMessageHash 发放，传入 message 信息，获取 hash
    4. 在 console 中输入 ethereum.request({ method: 'personal_sign', params: [_signer, hash] }) 弹出钱包确认，点开 Promise 获取 _sig
        0xad1f0415ea45f29c35568741e670517a4cc01ca7f94606eb04a66c767bd403526b68f2d0ebe1cbb4f2730c015d7335b909dd40a8c03901cf9a38ac6e51d8f3381c
    5. 测试 _split 函数
        size: 0x0000000000000000000000000000000000000000000000000000000000000041;
        r: 0xad1f0415ea45f29c35568741e670517a4cc01ca7f94606eb04a66c767bd40352;
        s: 0x6b68f2d0ebe1cbb4f2730c015d7335b909dd40a8c03901cf9a38ac6e51d8f338;
        v: 28 即 0x1c;
        _sig == r + s + v
    6. 调用 getEthSignedMessageHash，传入上面的 hash
        例如我这里得到：_ethSignedMessageHash
    7. 调用 recover，传入 _ethSignedMessageHash 和 _sig，就能得到上面 _signer 一致的值
    8. 测试 verify 返回 true
*/
