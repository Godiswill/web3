/**
 * Contract 类是对以太坊合约的抽象，用来与链上合约进行交互。
 *
 * 前面提到，provider 只能读操作，写交易需要 signer
 * contract 实例跟据传入参数第三个参数 provider、还是 singer 来限制是否可调用读、还是写方法
 *
 * 只读 contract：只能操作 view、pure 方法
 * const contract = new ethers.Contract(address, abi, provider);
 *
 * 可读写 contract：写入方法需要签名
 * const contract = new ethers.Contract(address, abi, signer);
 *
 * abi 介绍：https://github.com/AmazingAng/WTF-Solidity/blob/main/27_ABIEncode/readme.md
 *
 * 这里介绍 WETH、DAI 合约交互，读取 Vitalik WETH、DAI 的持仓
 * WETH 是 ETH ERC20 实现，与 ETH 1:1 兑换
 *  许多 DEx 交易是 ERC20 代币标准之间的交换，交换 ETH 实际也需要转换成 WETH
 * DAI 是锚定 ETH 等资产的稳定币，用户超额抵押 ETH 等资产产生 DAI
 */

import { ethers } from 'ethers';
import abiWETH from './abi/WETH.json' assert { type: 'json' };
// 利用公共rpc节点连接以太坊网络
// 可以在 https://chainlist.org 上找到
const ALCHEMY_MAINNET_URL = 'https://rpc.ankr.com/eth';
// 连接以太坊主网
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 第1种输入abi的方式: 复制abi全文
// WETH的abi可以在这里复制：https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code
const addressWETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // WETH Contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider);

// 第2种输入abi的方式：输入程序需要用到的函数，逗号分隔，ethers会自动帮你转换成相应的abi
// 人类可读abi，以ERC20合约为例
const abiERC20 = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint)',
];
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI Contract
const contractDAI = new ethers.Contract(addressDAI, abiERC20, provider);

const main = async () => {
  // 1. 读取WETH合约的链上信息（WETH abi）
  // 你也可以在以太浏览器查询 vitalik 余额 https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#readContract
  // 优秀的合约都是开源了代码，上传了 abi，所以可以在网页直接操作暴露的接口
  // etherscan 或 https://app.ens.domains/vitalik.eth 查询 ENS 对应的地址
  const nameWETH = await contractWETH.name();
  const symbolWETH = await contractWETH.symbol();
  const totalSupplyWETH = await contractWETH.totalSupply();
  console.log('\n1. 读取WETH合约信息');
  console.log(`合约地址: ${addressWETH}`);
  console.log(`名称: ${nameWETH}`);
  console.log(`代号: ${symbolWETH}`);
  console.log(`总供给: ${ethers.formatEther(totalSupplyWETH)}`);
  const balanceWETH = await contractWETH.balanceOf('vitalik.eth');
  console.log(`Vitalik持仓: ${ethers.formatEther(balanceWETH)}\n`);
  // 1. 读取WETH合约信息
  // 合约地址: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
  // 名称: Wrapped Ether
  // 代号: WETH
  // 总供给: 2926174.514152275309378814
  // Vitalik持仓: 0.00208378351637574

  // 2. 读取DAI合约的链上信息（IERC20接口合约）
  const nameDAI = await contractDAI.name();
  const symbolDAI = await contractDAI.symbol();
  const totalSupplDAI = await contractDAI.totalSupply();
  console.log('\n2. 读取DAI合约信息');
  console.log(`合约地址: ${addressDAI}`);
  console.log(`名称: ${nameDAI}`);
  console.log(`代号: ${symbolDAI}`);
  console.log(`总供给: ${ethers.formatEther(totalSupplDAI)}`);
  const balanceDAI = await contractDAI.balanceOf('vitalik.eth');
  console.log(`Vitalik持仓: ${ethers.formatEther(balanceDAI)}\n`);
  // 2. 读取DAI合约信息
  // 合约地址: 0x6B175474E89094C44Da98b954EedeAC495271d0F
  // 名称: Dai Stablecoin
  // 代号: DAI
  // 总供给: 3478279250.169356164874599846
  // Vitalik持仓: 1821.872440674356221452
};

main();
