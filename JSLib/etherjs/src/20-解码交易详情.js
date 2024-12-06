/**
 * 利用 ethers.Interface 类
 * 解析监听的未决交易
 */
import { ethers } from 'ethers';

// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const SEPOLIA_URL = 'wss://ethereum-sepolia-rpc.publicnode.com';
const provider = new ethers.WebSocketProvider(SEPOLIA_URL);

const iface = new ethers.Interface([
  'function transfer(address, uint) public returns (bool)',
]);
const selector = iface.getFunction('transfer').selector;
console.log(`函数选择器: ${selector}`);

// 处理bigInt
function handleBigInt(key, value) {
  // 处理无法解析 bigInt 类型的错误
  // TypeError: Do not know how to serialize a BigInt
  if (typeof value === 'bigint') {
    return value.toString() + 'n'; // or simply return value.toString();
  }
  return value;
}

let count = 0;
provider.on('pending', async (txHash) => {
  if (txHash) {
    const tx = await provider.getTransaction(txHash);
    if (tx?.data?.includes(selector)) {
      console.log(
        `[${new Date().toLocaleTimeString()}]监听到第${
          count + 1
        }个pending交易: ${txHash}\n`
      );
      console.log(tx);
      console.log(
        `\打印解码交易调用 transfer 方法详情: ${JSON.stringify(
          iface.parseTransaction(tx),
          handleBigInt,
          2
        )}`
      );
      console.log(`转账目标地址: ${iface.parseTransaction(tx).args[0]}`);
      console.log(
        `转账金额: ${ethers.formatEther(iface.parseTransaction(tx).args[1])}`
      );
      provider.removeListener('pending', this);
    }
  }
});

// 可以看到 Interface 解析合约函数定义，拿到函数 Hash 取比对交易 data 参数
// 根据参数类型，继续解析 data 可以拿到传入的参数值
// from 地址调用 to 合约地址，调用详情在 data 中

// 函数选择器: 0xa9059cbb
// [5:28:05 PM]监听到第1个pending交易: 0xc0e74dd671195a3a3515045d3eb38557d89229d1506633b384b2223bf2a7d68d

// TransactionResponse {
//   provider: WebSocketProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0xc0e74dd671195a3a3515045d3eb38557d89229d1506633b384b2223bf2a7d68d',
//   type: 2,
//   to: '0xb41328103Cb91BE18E2aCEf88df03eA59ADa75e5',
//   from: '0x5e809A85Aa182A9921EDD10a4163745bb3e36284',
//   nonce: 658449,
//   gasLimit: 57376n,
//   gasPrice: 9786636870n,
//   maxPriorityFeePerGas: 244868632n,
//   maxFeePerGas: 9786636870n,
//   maxFeePerBlobGas: null,
//   data: '0xa9059cbb00000000000000000000000022d71a0e50db6f77c9bd28ea0dd4b32edc338da80000000000000000000000000000000000000000000000000429d069189e0000',
//   value: 0n,
//   chainId: 11155111n,
//   signature: Signature { r: "0x3e7c2e67836ea07c3e0eccc01432d5e6aeab24a80ae1944d05975566146393cb", s: "0x39074ba8ad2a1a7f2badf9d5ae8e2ee0bc86bd18b75b8f498a1f7e65ba94a52e", yParity: 1, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null
// }

// 打印解码交易调用 transfer 方法详情: {
//   "fragment": {
//     "type": "function",
//     "inputs": [
//       {
//         "name": "",
//         "type": "address",
//         "baseType": "address",
//         "indexed": null,
//         "components": null,
//         "arrayLength": null,
//         "arrayChildren": null
//       },
//       {
//         "name": "",
//         "type": "uint256",
//         "baseType": "uint256",
//         "indexed": null,
//         "components": null,
//         "arrayLength": null,
//         "arrayChildren": null
//       }
//     ],
//     "name": "transfer",
//     "constant": false,
//     "outputs": [
//       {
//         "name": "",
//         "type": "bool",
//         "baseType": "bool",
//         "indexed": null,
//         "components": null,
//         "arrayLength": null,
//         "arrayChildren": null
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "payable": false,
//     "gas": null
//   },
//   "name": "transfer",
//   "args": [
//     "0x22d71a0e50DB6F77C9bD28ea0dD4B32eDc338Da8",
//     "300000000000000000n"
//   ],
//   "signature": "transfer(address,uint256)",
//   "selector": "0xa9059cbb",
//   "value": "0n"
// }
// 转账目标地址: 0x22d71a0e50DB6F77C9bD28ea0dD4B32eDc338Da8
// 转账金额: 0.3
