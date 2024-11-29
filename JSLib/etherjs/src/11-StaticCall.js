/**
 * ethers.Contract 类 staticCall 方法
 * 发送之前检查交易是否会失败。
 * 以太坊交易失败状态会回滚，但不会返还 gas，
 * 提前模拟检验交易是否成功，可以提醒用户，
 * 避免无意义的 gas 损失。
 *
 * 例如小狐狸钱包，会提醒无法评估 gas 费用，因为存在某些错误，交易会失败等信息。
 *
 * 以太节点有一个 eth_call 方法，可以让用户模拟一笔交易，并返回交易结果，
 * 但执行的状态不上真实的链。
 * const tx = await contract.函数名.staticCall(参数, {override});
 * console.log(`交易会成功吗？：`, tx);
 * 函数名：需要模拟调用的函数名
 * 参数：传入调用函数的参数
 * override ：对象选填，覆盖交易对象属性的值
 *  - from：函数执行人，合约中的 msg.sender，也就是你可以模拟任何一个人的调用，比如 Vitalik。
 *  - value：发送的 ETH，合约中的 msg.value。
 *  - blockTag：区块高度
 *  - gasPrice
 *  - gasLimit
 *  - nonce
 *  - ...
 */

import { ethers } from 'ethers';
const provider = ethers.getDefaultProvider();

const privateKey =
  '0xdf05966ab50e02a0c9b96a728ded9e646c2a324a8756bd0a2ef259902f72930d';
const wallet = new ethers.Wallet(privateKey, provider);
const address = await wallet.getAddress();

// DAI的ABI
const abiDAI = [
  'function balanceOf(address) public view returns(uint)',
  'function transfer(address, uint) public returns (bool)',
];
// DAI合约地址（主网）
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI Contract
// 创建DAI合约实例
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider);

console.log('\n1. 读取钱包的 DAI 余额');
const balanceDAI = await contractDAI.balanceOf(address);
console.log(`${address} DAI持仓: ${ethers.formatEther(balanceDAI)}`);
console.log(
  `Vitalik DAI持仓: ${ethers.formatEther(
    await contractDAI.balanceOf('vitalik.eth')
  )}`
);
// 0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37 DAI持仓: 0.0
// Vitalik DAI持仓: 1821.872440674356221452

console.log(`\n2. 模拟 Vitalik 给 ${address} 转账 1 DAI，`);
// 发起模拟交易
const tx = await contractDAI.transfer.staticCall(
  address,
  ethers.parseEther('1'),
  { from: await provider.resolveName('vitalik.eth') }
);
console.log(`交易会成功吗？：`, tx);
// 2. 模拟 Vitalik 给 0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37 转账 1 DAI，
// 交易会成功吗？： true

console.log(`\n3.  模拟 ${address} 给 Vitalik 转账 10000 DAI`);
const tx2 = await contractDAI.transfer.staticCall(
  'vitalik.eth',
  ethers.parseEther('10000'),
  { from: address }
);
console.log(`交易会成功吗？：`, tx2);
// 3.  模拟 0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37 给 Vitalik 转账 10000 DAI
// {
//   code: 'CALL_EXCEPTION',
//   action: 'call',
//   data: '0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000184461692f696e73756666696369656e742d62616c616e63650000000000000000',
//   reason: 'Dai/insufficient-balance',
//   transaction: {
//     to: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
//     data: '0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000021e19e0c9bab2400000',
//     from: '0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37'
//   },
//   invocation: {
//     method: 'transfer',
//     signature: 'transfer(address,uint256)',
//     args: Result(2) [
//       '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
//       10000000000000000000000n
//     ]
//   },
//   revert: {
//     signature: 'Error(string)',
//     name: 'Error',
//     args: [ 'Dai/insufficient-balance' ]
//   },
//   shortMessage: 'execution reverted: "Dai/insufficient-balance"'
// }

// 模拟交易，计算 dex 交易滑点？
