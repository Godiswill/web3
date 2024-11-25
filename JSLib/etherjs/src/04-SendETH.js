/**
 * Web3.js 默认用户会部署以太坊节点，网络链接和私钥签名等由节点完成
 * ethers.js 拆分成 Provider、Signer 类，前者管理网络链接，后者管理私钥签名
 *
 * Signer 是以太坊账户的抽象。以太坊数据变更需要账户私钥签名来完成交易。
 * Signer 类是抽象类，不能直接实例化，需要它的子类：Wallet
 * 以下介绍 Wallet 实例创建的几种方法和如何发送 ETH
 */

// 利用Wallet类发送ETH
import { ethers } from 'ethers';

// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.api.onfinality.io/public';
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

console.log('当前网络：\n', (await provider.getNetwork()).toJSON());

// 方法1: 创建随机的 wallet 对象
const wallet1 = ethers.Wallet.createRandom();
const wallet1WithProvider = wallet1.connect(provider);
const mnemonic = wallet1.mnemonic; // 获取助记词

// 方法2: 私钥创建 wallet 对象
// metal cereal clump disagree sight recall catch they fire diagram swallow nurse
const privateKey =
  '0xdf05966ab50e02a0c9b96a728ded9e646c2a324a8756bd0a2ef259902f72930d';
const wallet2 = new ethers.Wallet(privateKey, provider);

// 方法3: 助记词创建 wallet 对象
// 从方法1 的助记词创建钱包，其地址一样
const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase);

const address1 = await wallet1.getAddress();
const address2 = await wallet2.getAddress();
const address3 = await wallet3.getAddress(); // 获取地址
console.log(`1. 获取钱包地址`);
console.log(`钱包1地址: ${address1}`);
console.log(`钱包2地址: ${address2}`);
console.log(`钱包3地址: ${address3}`);
console.log(`钱包1和钱包3的地址是否相同: ${address1 === address3}`);
// 1. 获取钱包地址
// 钱包1地址: 0xd2482Fc61B7d7f9c803E9728C00528da3aba0b90
// 钱包2地址: 0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37
// 钱包3地址: 0xd2482Fc61B7d7f9c803E9728C00528da3aba0b90
// 钱包1和钱包3的地址是否相同: true

console.log(`\n2. 获取助记词`);
console.log(`钱包1助记词: ${wallet1.mnemonic.phrase}`);
console.log(`钱包2助记词: ${wallet2.mnemonic?.phrase}`); // 私钥不能反推助记词
console.log(`钱包3助记词: ${wallet3.mnemonic.phrase}`);
// 2. 获取助记词
// 钱包1助记词: chase mistake travel will clean warm faculty drill notice ensure reopen flag
// 钱包2助记词: undefined
// 钱包3助记词: chase mistake travel will clean warm faculty drill notice ensure reopen flag

console.log(`\n3. 获取私钥`);
console.log(`钱包1私钥: ${wallet1.privateKey}`);
console.log(`钱包2私钥: ${wallet2.privateKey}`);
console.log(`钱包3私钥: ${wallet3.privateKey}`);
// 3. 获取私钥
// 钱包1私钥: 0xa082cc29984e3561bff25356287e232e984188e0194947ff439ae8ca83473d1f
// 钱包2私钥: 0xdf05966ab50e02a0c9b96a728ded9e646c2a324a8756bd0a2ef259902f72930d
// 钱包3私钥: 0xa082cc29984e3561bff25356287e232e984188e0194947ff439ae8ca83473d1f

console.log(`\n4. 获取链上交易数`);
const txCount1 = await provider.getTransactionCount(wallet1WithProvider);
const txCount2 = await provider.getTransactionCount(wallet2);
console.log(`钱包1发送交易次数: ${txCount1}`);
console.log(`钱包2发送交易次数: ${txCount2}`); // 下次交易的 nonce 值
// 4. 获取链上交易数
// 钱包1发送交易次数: 0
// 钱包2发送交易次数: 1

// 5. 发送ETH
// 如果这个钱包没 sepolia 测试网ETH了，去水龙头领一些，钱包地址: 0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37
// chainlink水龙头: https://faucets.chain.link/sepolia
console.log(`\n5. 发送ETH（测试网）`);
// i. 打印交易前余额
console.log(`i. 发送前余额`);
console.log(
  `钱包1: ${ethers.formatEther(
    await provider.getBalance(wallet1WithProvider)
  )} ETH`
);
console.log(
  `钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`
);
// ii. 构造交易请求，参数：to为接收地址，value为ETH数额
const tx = {
  to: address1,
  value: ethers.parseEther('0.001'),
  // sendTransaction 会填充数据如
  // chainId、nonce、gas、gasLimit、gasPrice 等信息
  // 新的标准 type: 2 还有 maxFeePerGas、maxPriorityFeePerGas
};
// 5. 发送ETH（测试网）
// i. 发送前余额
// 钱包1: 0.0 ETH
// 钱包2: 0.009846925489222 ETH

// iii. 发送交易，获得收据
console.log(`\nii. 等待交易在区块链确认（需要几分钟）`);
const receipt = await wallet2.sendTransaction(tx);
await receipt.wait(); // 等待链上确认交易
console.log(receipt); // 打印交易详情
// iv. 打印交易后余额
console.log(`\niii. 发送后余额`);
console.log(
  `钱包1: ${ethers.formatEther(
    await provider.getBalance(wallet1WithProvider)
  )} ETH`
);
console.log(
  `钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`
);
// ii. 等待交易在区块链确认（需要几分钟）
// TransactionResponse {
//   provider: JsonRpcProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0xc9ac7de186783bfe6eb743c2d2d22722aea5969abe8ec01ae639dbe74ef81195',
//   type: 2,
//   to: '0xd2482Fc61B7d7f9c803E9728C00528da3aba0b90',
//   from: '0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37',
//   nonce: 1,
//   gasLimit: 21000n,
//   gasPrice: undefined,
//   maxPriorityFeePerGas: 1000000n,
//   maxFeePerGas: 7293583344n,
//   maxFeePerBlobGas: null,
//   data: '0x',
//   value: 1000000000000000n,
//   chainId: 11155111n,
//   signature: Signature { r: "0x664b5f2d88d45cfa64c84e4fa8622065600e46564e15f15f88e9ea84c702212a", s: "0x0be9353ed9ad76960fce802a8c55d0c538ec44f8d357ca8118c1de9a43b20b65", yParity: 1, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null
// }

// iii. 发送后余额
// 钱包1: 0.001 ETH
// 钱包2: 0.008770722753039 ETH
