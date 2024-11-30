/**
 * 用 calldata 与测试网 WETH 合约交互
 * 可以和 05 的代码对比
 *
 * calldata 在 remix 中合约部署后的最下面有个
 * Low level interactions
 * CALLDATA
 * 可以传入函数哈希和参数编码后的 16 进制串来直接调用合约方法
 * 也可以传入不存在的函数调用，来测试 fallback 函数
 *
 * ethers.Interface 类生成实例可以进行 calldata 调用的编码
 * 一般结合 Contract 实例使用，实例上属性上会生成一个 interface 对象
 * // 利用 abi 生成
 * const interface = ethers.Interface(abi)
 * // 直接从 contract 实例对象中获取
 * const interface2 = contract.interface
 *
 * interface 的一些方法
 * // 1. 获取函数选择器
 * interface.getSighash("balanceOf");
 * // '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
 * // 2. 编码构造器的参数
 * interface.encodeDeploy("Wrapped ETH", "WETH");
 * // 3. 编码函数的 calldata
 * interface.encodeFunctionData("balanceOf", ["0xc778417e063141139fce010982780140aa0cd5ab"]);
 * // 4. 解码函数的返回值
 * interface.decodeFunctionResult("balanceOf", resultData)
 *
 * 可以点开展开 remix 中函数调用 log：
 *  input 即是上面 3 的 calldata 编码
 *  decoded output	即是 4 解码的返回值
 */

import { ethers } from 'ethers';

// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.api.onfinality.io/public';
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

const privateKey =
  '0xdf05966ab50e02a0c9b96a728ded9e646c2a324a8756bd0a2ef259902f72930d';
const wallet = new ethers.Wallet(privateKey, provider);

// WETH的ABI
// WETH的ABI
const abiWETH = [
  'function balanceOf(address) public view returns(uint)',
  'function deposit() public payable',
];

// WETH合约地址（Sepolia 测试网）
const addressWETH = '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa'; // WETH Contract

// 声明可写合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);

const address = await wallet.getAddress();
// 1. 读取WETH合约的链上信息（WETH abi）
console.log('\n1. 读取 WETH 余额');
// 编码calldata
const param1 = contractWETH.interface.encodeFunctionData('balanceOf', [
  address,
]);
console.log(`编码结果： ${param1}`);
// 创建交易
const tx1 = {
  to: addressWETH,
  data: param1,
};
// 发起交易，可读操作（view/pure）可以用 provider.call(tx)
const balanceWETH = await provider.call(tx1);
// 以上可以更深入理解 contractWETH.balanceOf(address) 调用过程
// const balanceWETH = await contractWETH.balanceOf(address);
console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`);
// 1. 读取 WETH 余额
// 编码结果： 0x70a082310000000000000000000000003cf9a3265e00cfbda31bcfb90a11a684861d0e37
// 存款前WETH持仓: 0.0

// 编码calldata
const param2 = contractWETH.interface.encodeFunctionData('deposit');
console.log(`编码结果： ${param2}`);
// 创建交易
const tx2 = {
  to: addressWETH,
  data: param2,
  value: ethers.parseEther('0.001'),
};
// 发起交易，写入操作需要 wallet.sendTransaction(tx)
const receipt1 = await wallet.sendTransaction(tx2);
// 等待交易上链
await receipt1.wait();
// const tx = await contractWETH.deposit({
//   value: ethers.parseEther('0.001'),
// });
// // 等待交易上链
// await tx.wait();
console.log(`交易详情：`);
console.log(receipt1);
const balanceWETH_deposit = await contractWETH.balanceOf(address);
console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`);
// 编码结果： 0xd0e30db0
// 交易详情：
// TransactionResponse {
//   provider: JsonRpcProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0x668cdf4c1b97778b27c179fad79e53fb41ae850ed4681bd206c367f085a6eb03',
//   type: 2,
//   to: '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa',
//   from: '0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37',
//   nonce: 8,
//   gasLimit: 52933n,
//   gasPrice: undefined,
//   maxPriorityFeePerGas: 1000000n,
//   maxFeePerGas: 10705005794n,
//   maxFeePerBlobGas: null,
//   data: '0xd0e30db0',
//   value: 1000000000000000n,
//   chainId: 11155111n,
//   signature: Signature { r: "0xa8d21117874e91f464c6f1a479534e6b2ec7f04d150f1806f420b9b2db88892d", s: "0x0c36b1ee8fe6fc4c133fc458932b01a85683377a573dfe7ff5e5afff406232a8", yParity: 1, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null
// }
// 存款后WETH持仓: 0.001
