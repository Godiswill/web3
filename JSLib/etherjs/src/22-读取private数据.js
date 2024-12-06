/**
 * 虽然智能合约上的 private 数据没有 getter 函数
 * 但可以通过 slot 索引读取链上存储的数据
 *
 * solidity 基础存储类型为 uint256（32 bytes），
 * 这个基础类型的存储大小的空间称为 slot 插槽，
 * 从 slot 0 开始，每个基础数据类型占一个 slot，例如 uint256， address 等
 *
 * 链上数据都是可见了，不要在合约中存储私密数据
 * 下面例子是读取 Arbitrum 跨链桥合约的所有者
 */

import { ethers } from 'ethers';

const provider = new ethers.getDefaultProvider();

// 目标合约地址: Arbitrum ERC20 bridge（主网）
const addressBridge = '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'; // DAI Contract
// 合约所有者 slot
const slot = `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`;

console.log('开始读取特定 slot 的数据');
const privateData = await provider.getStorage(addressBridge, slot);
console.log(
  '读出的数据（owner地址）: ',
  ethers.getAddress(ethers.dataSlice(privateData, 12))
);

// 开始读取特定 slot 的数据
// 读出的数据（owner地址）:  0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD
