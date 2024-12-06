/**
 * mempool 交易内存池
 *
 * MEV（Maximal Extractable Value）最大可提取价值，
 * 用来衡量矿工在区块链中通过排除、重排、打包交易获取的利率。
 *
 * 在交易被打包上链之前，所有的交易会汇集到 Mempool 中，
 * 矿工在交易池中挑选费用高的交易进行优先打包，以实现利润最大化。
 * gas price 越高的交易越容易被打包
 *
 * MEV 机器人可以监听寻找 mempool 有利可图的交易，例如设置滑点过高
 * 的 Dex swap 交易可能被三明治攻击，通过提高 gas，机器人在该笔交易
 * 之前抢跑一个买单（滑点高，买入会导致价格上涨过高），之后发送一个卖单，
 * 相当于以高价卖给产生这笔交易的用户。
 *
 * 以下例子介绍如何监听 mempool
 */

import { ethers } from 'ethers';

// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const SEPOLIA_URL = 'wss://ethereum-sepolia-rpc.publicnode.com';
const provider = new ethers.WebSocketProvider(SEPOLIA_URL);

// 节流
function throttle(fn, delay) {
  let timer;
  return function () {
    if (!timer) {
      fn.apply(this, arguments);
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}

// let i = 0;
// provider.on('pending', async (txHash) => {
//   if (txHash && i < 10) {
//     // 打印txHash
//     console.log(
//       `[${new Date().toLocaleTimeString()}] 监听Pending交易 ${i}: ${txHash} \r`
//     );
//     i++;
//   }
// });
// [3:59:27 PM] 监听Pending交易 0: 0x5e4ebf958392e5b0bd300424bb54fb42bc60e0b1b46b8dac7077a35333528227
// [3:59:27 PM] 监听Pending交易 1: 0x96effd531577b8a1b410bee340a7e99e89e2709dc8a2638bf1633116cb5407bf
// [3:59:27 PM] 监听Pending交易 2: 0xe04e2e2c26aec239debdb13caaf7e965fb7798f8a7f315f7bcc7c954bffc936a
// [3:59:27 PM] 监听Pending交易 3: 0xc1114ee4271ab1bbf4cd298cfba5ab2a3996df5b311296461bb78ae688bdf6af
// [3:59:27 PM] 监听Pending交易 4: 0xd8a7cd5854977ff19b8159a4bbd1dc971105515da57d0343636b831fef1dd87e
// [3:59:27 PM] 监听Pending交易 5: 0xe1ad0ef0269b3dc71caa397c0cfeb5e3b7f7c825712ccce2dd583828cbc65571
// [3:59:27 PM] 监听Pending交易 6: 0x7f3ef12bc9abf8f2c6a48a1667895f13e58cb0cd52e93a50ae3aa7edaf1862a0
// [3:59:27 PM] 监听Pending交易 7: 0x088675df7e0221e204059ce0410ba5e15f021d059a56e0051476be462dcfd5cf
// [3:59:28 PM] 监听Pending交易 8: 0xd6738516a82462413767a47e0636c83ec5ff6fcae94d26f7ca7259225fbd7e3a
// [3:59:28 PM] 监听Pending交易 9: 0x07fce09a5c127fb3813b97670f033f60c7126c7c50356b10867b8feab7ce84f7

let j = 0;
provider.on(
  'pending',
  throttle(async (txHash) => {
    if (txHash && j < 10) {
      // 获取tx详情
      let tx = await provider.getTransaction(txHash);
      console.log(
        `\n[${new Date().toLocaleTimeString()}] 监听Pending交易 ${j}: ${txHash} \r`
      );
      console.log(tx);
      j++;
    }
  }, 1000)
);
// 下面可以看到，未被打包进区块的交易
// blockNumber、blockHash 等均为空
// 但是交易的主要信息，都可以拿到
// 发送地址 from、交易地址 to，发送以太数量 value，交易费 gasPrice
// data 里可以是合约字节码，或合约调用函数和参数
// 机器人可以解析这些信息，进行 MEV 挖掘。

// [4:02:44 PM] 监听Pending交易 0: 0x928f262de02e24d2b7f2fb9cca649e435a80e70c7afd08bd440f5081134b9707
// TransactionResponse {
//   provider: WebSocketProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0x928f262de02e24d2b7f2fb9cca649e435a80e70c7afd08bd440f5081134b9707',
//   type: 2,
//   to: '0xff00000000000000000000000000000000062429',
//   from: '0x9a94E121de3A8715dfAdCADDB5F4cc4138dABBE2',
//   nonce: 401185,
//   gasLimit: 26636n,
//   gasPrice: 15339567706n,
//   maxPriorityFeePerGas: 1000000000n,
//   maxFeePerGas: 15339567706n,
//   maxFeePerBlobGas: null,
//   data: '0x00e75d4e18c6ae763b',
//   value: 0n,
//   chainId: 11155111n,
//   signature: Signature { r: "0xde1f5fcd7dfc78f390b5ae69b7a39f3b5e55009fa3b2eee9d07fd64b14e370e4", s: "0x179dd771c30142a3b80cdb8805e03242263560312147d21ea74d0664b06a3da6", yParity: 0, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null
// }
