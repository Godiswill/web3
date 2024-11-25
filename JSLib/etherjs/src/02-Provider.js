/**
 * Provider类
 * Provider类是对以太坊网络连接的抽象，提供访问以太坊节点接口。
 * Provider不接触用户私钥，只能读链上数据，不能写。
 * ethers 相比 web3.js 要安全，类职责分离，Provider 只读，
 * 写的话需要 Signer 来签名后操作。
 *
 * 以下主要介绍 Provider 能查询到哪些数据
 */

import { ethers } from 'ethers';

// 上文提到 defaultProvider，实际常用的是jsonRpcProvider，可以让用户连接到特定节点服务商的节点。
// 最出名的有 Infura、Alchemy 等。需要明白的是连接区块链网络，是需要搭建节点服务器的，
// 公开的接口用的人多限速很慢，有条件自己建，或使用节点服务提供商的接口

// 利用公共rpc节点连接以太坊网络
// 可以在 https://chainlist.org 上找到
const ALCHEMY_MAINNET_URL = 'https://rpc.ankr.com/eth';
// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.api.onfinality.io/public';
// 连接以太坊主网
const providerETH = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
// 连接Sepolia测试网
const providerSepolia = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

// 1. 查询vitalik在主网和Sepolia测试网的ETH余额
console.log('1. 查询vitalik在主网和Sepolia测试网的ETH余额');
const balance = await providerETH.getBalance(`vitalik.eth`);
// 文章中提到测试完不支持 ENS，现在也支持了
const balanceSepolia = await providerSepolia.getBalance(`vitalik.eth`);
// const balanceSepolia = await providerSepolia.getBalance(
//   `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
// );
const test = await providerSepolia.getBalance(
  `0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37`
);
// 将余额输出在console（主网）
console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
// 输出Sepolia测试网ETH余额
console.log(
  `Sepolia ETH Balance of vitalik: ${ethers.formatEther(balanceSepolia)} ETH`
);
console.log(
  `0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37: ${ethers.formatEther(test)} ETH`
);
// 1. 查询vitalik在主网和Sepolia测试网的ETH余额
// ETH Balance of vitalik: 714.679338274638442434 ETH
// Sepolia ETH Balance of vitalik: 25.211317178012215547 ETH

// 2. 查询provider连接到了哪条链
console.log('\n2. 查询provider连接到了哪条链');
const network = await providerETH.getNetwork();
console.log(network.toJSON());
const sepoliaNetwork = await providerSepolia.getNetwork();
console.log(sepoliaNetwork.toJSON());
// 2. 查询provider连接到了哪条链
// { name: 'mainnet', chainId: '1' }
// { name: 'sepolia', chainId: '11155111' }

// 3. 查询区块高度
console.log('\n3. 查询区块高度');
const blockNumber = await providerETH.getBlockNumber();
console.log(blockNumber);
// 3. 查询区块高度
// 21262367

// 7. 给定合约地址查询合约bytecode，例子用的WETH地址

// 4. 查询 vitalik 钱包历史交易次数
console.log('\n4. 查询 vitalik 钱包历史交易次数');
const txCount = await providerETH.getTransactionCount('vitalik.eth');
console.log(txCount);
// 4. 查询 vitalik 钱包历史交易次数
// 1428

// 5. 查询当前建议的gas设置
console.log('\n5. 查询当前建议的gas设置');
const feeData = await providerETH.getFeeData();
console.log(feeData); // bigint 类型
// 5. 查询当前建议的gas设置
// FeeData {
//   gasPrice: 7663129485n,
//   maxFeePerGas: 16059971342n,
//   maxPriorityFeePerGas: 2820000n
// }

// 6. 查询区块信息
console.log('\n6. 查询区块信息');
const block = await providerETH.getBlock(0); // 参数为区块高度
console.log(block);
// 6. 查询区块信息
// Block {
//   provider: JsonRpcProvider {},
//   number: 0,
//   hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
//   timestamp: 0,
//   parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
//   parentBeaconBlockRoot: null,
//   nonce: '0x0000000000000042',
//   difficulty: 17179869184n,
//   gasLimit: 5000n,
//   gasUsed: 0n,
//   stateRoot: '0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544',
//   receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
//   blobGasUsed: null,
//   excessBlobGas: null,
//   miner: '0x0000000000000000000000000000000000000000',
//   prevRandao: '0x0000000000000000000000000000000000000000000000000000000000000000',
//   extraData: '0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa',
//   baseFeePerGas: null
// }

console.log('\n7. 给定合约地址查询合约bytecode，例子用的WETH地址');
const code = await providerETH.getCode(
  '0xc778417e063141139fce010982780140aa0cd5ab'
);
console.log(code);
// 7. 给定合约地址查询合约bytecode，例子用的WETH地址
// 0x6060604052361561010f5763ffffffff7c0100...
