/**
 * 查询 V 神 vitalik.eth ENS 地址的 ETH 余额
 * Etherscan 查到的地址是 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
 * 2024.11.25 余额 714.679338274638442434 ETH
 */

import { ethers } from 'ethers';
const provider = new ethers.getDefaultProvider(); // ethers 默认提供的 provider，公开用的人多 速度很慢
// 生产环境可使用以下方式，不过下面的已被禁用，仅作参考
// const ALCHEMY_MAINNET_URL =
//   'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
// const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
const main = async () => {
  const balance = await provider.getBalance('vitalik.eth');
  console.log(`ETH balance of vitalik: ${ethers.formatEther(balance)}`);
  // node 01-HelloVitalik.js
  // ETH balance of vitalik: 714.679338274638442434
};

main();
