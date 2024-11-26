/**
 * ethers.js Contract 类也提供了监听事件的方法
 * contract.on('eventName', callback);
 *  contract.once 一次
 */

import { ethers } from 'ethers';

// 测试网的事件触发概率太低，这里使用公开的主网 rpc
// https://chainlist.org/chain/1
// const MAINNET_URL = 'https://1rpc.io/eth';
// 连接主网 provider
// const provider = new ethers.JsonRpcProvider(MAINNET_URL);
const provider = new ethers.getDefaultProvider();

// 监听 USDT https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7
// USDT的合约地址
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
// 构建USDT的Transfer的ABI
const abi = [
  'event Transfer(address indexed from, address indexed to, uint value)',
];
// 生成USDT合约对象
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);
// 只监听一次
console.log('\n1. 利用contract.once()，监听一次Transfer事件');
contractUSDT.once('Transfer', (from, to, value) => {
  // 打印结果
  console.log(
    `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value), 6)}`
  );
});
// 1. 利用contract.once()，监听一次Transfer事件
// 0x1cA5aa5b1dd8D948bB0971A5fB1762FE172E0040 -> 0xA971E0039d164F4470E1819f94Ca22395a847ccd 5381.5

// 持续监听USDT合约，免费开放的有调用次数限制，测试最好用自己的节点
// console.log('\n2. 利用contract.on()，持续监听Transfer事件');
// contractUSDT.on('Transfer', (from, to, value) => {
//   console.log(
//     // 打印结果
//     `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value), 6)}`
//   );
// });
