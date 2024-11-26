/**
 * 过滤器
 * Contract.filters
 * 根据索引过滤事件日志数据
 * 最多可以包含[4]条数据作为索引（indexed）。
 * 索引数据经过哈希处理并包含在布隆过滤器中，这
 * 是一种允许有效过滤的数据结构。
 * 因此，一个事件过滤器最多包含4个主题集，
 * （匿名事件可以 indexed 4 个参数，因为事件 hash 本身占一个，
 * 实际最多 3 个 indexed）
 * 每个主题集是个条件，用于筛选目标事件。规则：
 *  - 如果一个主题集为null，则该位置的日志主题不会被过滤，任何值都匹配。
 *  - 如果主题集是单个值，则该位置的日志主题必须与该值匹配。
 *  - 如果主题集是数组，则该位置的日志主题至少与数组中其中一个匹配。
 * 
 * 1. 构造过滤器: filter = contract.filter.EventName(index1, index2, ...);
 * 2. 监听事件：  contract.on(filter, callback);
 */

// 监听交易所的USDT转账
// 币安热钱包转账 USDT：https://etherscan.io/tx/0xab1f7b575600c4517a2e479e46e3af98a95ee84dd3f46824e02ff4618523fff5#eventlog
import { ethers } from 'ethers';
const provider = new ethers.getDefaultProvider();
// 合约地址
const addressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
// 交易所地址
const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60';
// 构建ABI
const abi = [
  'event Transfer(address indexed from, address indexed to, uint value)',
  'function balanceOf(address) public view returns(uint)',
];
// 构建合约对象
const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);

const balanceUSDT = await contractUSDT.balanceOf(accountBinance);
console.log(`1. USDT余额: ${ethers.formatUnits(balanceUSDT, 6)}\n`);
// 1. USDT余额: 1222957013.238597

// 2. 创建过滤器，监听转移USDT进交易所
console.log('\n2. 创建过滤器，监听USDT转进交易所');
let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
console.log('过滤器详情：');
console.log(filterBinanceIn);
contractUSDT.on(filterBinanceIn, (res) => {
  console.log('---------监听USDT进入交易所--------');
  console.log(
    `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2], 6)}`
  );
});
// 2. 创建过滤器，监听USDT转进交易所
// 过滤器详情：
// PreparedTopicFilter {
//   fragment: EventFragment {
//     type: 'event',
//     inputs: [ [ParamType], [ParamType], [ParamType] ],
//     name: 'Transfer',
//     anonymous: false
//   }
// }

// 3. 创建过滤器，监听交易所转出USDT
let filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance);
console.log('\n3. 创建过滤器，监听USDT转出交易所');
console.log('过滤器详情：');
console.log(filterToBinanceOut);
contractUSDT.on(filterToBinanceOut, (res) => {
  console.log('---------监听USDT转出交易所--------');
  console.log(
    `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2], 6)}`
  );
});
// 3. 创建过滤器，监听USDT转出交易所
// 过滤器详情：
// PreparedTopicFilter {
//   fragment: EventFragment {
//     type: 'event',
//     inputs: [ [ParamType], [ParamType], [ParamType] ],
//     name: 'Transfer',
//     anonymous: false
//   }
// }

// ---------监听USDT转出交易所--------
// 0x28C6c06298d514Db089934071355E5743bf21d60 -> 0x0237D34ab584986DE8DAE31cBa0880Ce39FB9BF5 24.0
// ---------监听USDT转出交易所--------
// 0x28C6c06298d514Db089934071355E5743bf21d60 -> 0x9125576AD65088955454E653841E5cd6B488b9a4 10.0
// ---------监听USDT进入交易所--------
// 0x61aB3d3637f27573bc5409f219cba6841e7bD18c -> 0x28C6c06298d514Db089934071355E5743bf21d60 6979.116223
// ---------监听USDT进入交易所--------
// 0x594127C810E3bD8d14a08678Abf015aF0d48311B -> 0x28C6c06298d514Db089934071355E5743bf21d60 3000.0
// ---------监听USDT进入交易所--------
// 0x63029A106573D631A23DBc4Fd124971385551650 -> 0x28C6c06298d514Db089934071355E5743bf21d60 3127.27
// ---------监听USDT转出交易所--------
// 0x28C6c06298d514Db089934071355E5743bf21d60 -> 0xBC4993de731BE0858feF3F4526306aa20F912F19 294.0
// ---------监听USDT转出交易所--------
// 0x28C6c06298d514Db089934071355E5743bf21d60 -> 0x416514EA82f1357aE576aEdE6f5259054262902C 100.0