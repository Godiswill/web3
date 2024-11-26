/**
 * Event 触发产生的数据存储在以太坊虚拟机的日志中。日志数据分两部分：
 *  1. 主题 topics 存储事件 hash 和被 indexed 标记的变量，作为索引方便检索
 *  2. 数据 data 存储未被标记 indexed 的变量，不能呗检索，但可以存储更复杂的数据结构
 * WETH Transfer 事件
 *  event  Transfer(address indexed src, address indexed dst, uint wad);
 *
 * https://etherscan.io/tx/0x7a13751561409018e2c518cea74d4b3b56cc45e0cc266807df34776c201968bc#eventlog
 *
 * 随便找一个 WETH 交易详情，在 Logs 中可以看到：
 *  Topics：事件的 hash 和 indexed 的 src、dst 两个地址，记录了每笔转账过程
 *  Data：未被 indexed 的转账数额
 *
 * ethers 中可以使用 Contract 实例.queryFilter('事件名', [起始区块, 结束区块]) 获取日志数据
 */

// 检查 WETH 合约中的 Transfer 事件
import { ethers } from 'ethers';
import abiWETH from './abi/WETH.json' assert { type: 'json' };

// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const ALCHEMY_SEPOLIA_URL = 'https://1rpc.io/sepolia';
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

// WETH合约地址（Sepolia 测试网）
const addressWETH = '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa'; // WETH Contract

// 合约实例
const contract = new ethers.Contract(addressWETH, abiWETH, provider);

// 得到当前的 block
const block = await provider.getBlockNumber();
console.log(`当前区块高度: ${block}`);
console.log(`打印事件详情:`);
// 获取最新 10 个区块内的 Transfer 事件
const transferEvents = await contract.queryFilter(
  'Transfer',
  // block - 100, // 最近的 100 个区块可以没有事件
  // block
  7150210,
  7150215
);
// 打印第一个看看内容
console.log(transferEvents[0]);
// 当前区块高度: 7155119
// 打印事件详情:
// EventLog {
//   provider: JsonRpcProvider {},
//   transactionHash: '0x957aa0a6da4f130d02fa1a63fa7063cbc8e1db8831a277041a88d926940a4ac5',
//   blockHash: '0x55cab9701e60d51f8aa06248b8ebe8364bc60fa3534e4cc5020630821b873df7',
//   blockNumber: 7150215,
//   removed: false,
//   address: '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa',
//   data: '0x0000000000000000000000000000000000000000000000000002d79883d20000',
//   topics: [
//     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//     '0x0000000000000000000000000000000000000000000000000000000000000000',
//     '0x000000000000000000000000441615d388d49bb4af8b257e767f2b84e13e8ad1'
//   ],
//   index: 34,
//   transactionIndex: 12,
//   interface: Interface {
//     fragments: [
//       [FunctionFragment], [FunctionFragment],
//       [FunctionFragment], [FunctionFragment],
//       [FunctionFragment], [FunctionFragment],
//       [FunctionFragment], [FunctionFragment],
//       [FunctionFragment], [FunctionFragment],
//       [FunctionFragment], [FallbackFragment],
//       [EventFragment],    [EventFragment],
//       [EventFragment],    [EventFragment]
//     ],
//     deploy: ConstructorFragment {
//       type: 'constructor',
//       inputs: [],
//       payable: false,
//       gas: null
//     },
//     fallback: FallbackFragment {
//       type: 'fallback',
//       inputs: [Array],
//       payable: true
//     },
//     receive: true
//   },
//   fragment: EventFragment {
//     type: 'event',
//     inputs: [ [ParamType], [ParamType], [ParamType] ],
//     name: 'Transfer',
//     anonymous: false
//   },
//   args: Result(3) [
//     '0x0000000000000000000000000000000000000000',
//     '0x441615d388d49bb4AF8b257e767F2b84e13e8aD1',
//     800000000000000n
//   ]
// }

// 解析Transfer事件的数据（变量在args中）
console.log('\n2. 解析事件：');
const amount = ethers.formatUnits(
  ethers.getBigInt(transferEvents[0].args[2]),
  'ether'
);
console.log(
  `地址 ${transferEvents[0].args[0]} 转账${amount} WETH 到地址 ${transferEvents[0].args[1]}`
);
// 合约转账到用户地址 0.0008 WETH
// 2. 解析事件：
// 地址 0x0000000000000000000000000000000000000000
//  转账0.0008 WETH
//  到地址 0x441615d388d49bb4AF8b257e767F2b84e13e8aD1
