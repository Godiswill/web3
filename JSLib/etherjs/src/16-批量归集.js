/**
 * 接上一章，把批量转出去的 ETH、WETH 归集回来
 * 需要更账户 ETH、WETH 充足，不然会报错
 * 执行时预估 gas 会高于实际 gas 很多，
 * 一般是没有足够的 ETH 引发的错误
 */

import { ethers } from 'ethers';
// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.api.onfinality.io/public';
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

console.log('\n1. 助记词创建 HD 钱包');
const mnemonic =
  'metal cereal clump disagree sight recall catch they fire diagram swallow nurse';
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
const wallet = new ethers.Wallet(hdNode.privateKey, provider);
console.log(hdNode);
// 1. 助记词创建 HD 钱包
// HDNodeWallet {
//   provider: null,
//   address: '0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37',
//   publicKey: '0x027aa4ae560ca8ba74daeafa9fd1f8f1571a4cd3b8ec7407ef37bb468890082600',
//   fingerprint: '0x8a8e58f6',
//   parentFingerprint: '0x25404ca5',
//   mnemonic: Mnemonic {
//     phrase: 'metal cereal clump disagree sight recall catch they fire diagram swallow nurse',
//     password: '',
//     wordlist: LangEn { locale: 'en' },
//     entropy: '0x8c04b0b11f6c8366c9070457279f6c4b'
//   },
//   chainCode: '0x5108073eb7274dee7d6723fc70eb3ca553cc87c9be876b861f26f79a4d797a88',
//   path: "m/44'/60'/0'/0/0",
//   index: 0,
//   depth: 5
// }

const numWallet = 20;
const wallets = [];
for (let i = 0; i < numWallet; i++) {
  const hdNodeNew = hdNode.derivePath(i.toString());
  const walletNew = new ethers.Wallet(hdNodeNew.privateKey);
  wallets.push(walletNew);
  console.log(walletNew.address);
}
// 定义发送金额
const amount = ethers.parseEther('0.0001');
console.log(`发送数额：${amount}`);
// 0x0d0c3c8015201C0c53f3Db1d5e8fcfD436b3f971
// 0xC9d004609BAdbbb94AD7Acd592B62B32Aaa7067d
// 0x40acB63e3145f30185f1682F26D12C9De9B44133
// 0x75d052486D2Cd080bF9Bdc59Ce763f65Ee7406A7
// 0x02a2E6c1392F602C887E194aB2cB58490e000d16
// 0x610723f5d61D8519319FAE727776CfC1D2f95d2d
// 0x5299e2888a5825c3D42BB575407E683fC556081b
// 0x4b3db368023A38FBCf225eD7eDa7230AF413E4c9
// 0x86693D67595FA1ce4Aa607F9E692078FEE7E719f
// 0xbf299e6863A2eC962f6220D156B96267f686eFE2
// 0xb5FFe4e8723e4C6762d804d21b329e7F7939D9bf
// 0x4551F2A1B69F74FF448B0017f9495767f3546844
// 0x6722504425e97591982433e4Fc6cbF36ee38D0b1
// 0x0bf0EA2a63f766bd9903388Bc8ACe94d626Becdf
// 0x23324199e6Bda1a75F16d7C5a7FEe90386795b43
// 0xDca3Bc867887a0C081E6849105595AFbf996D4Cc
// 0x5fA46b08cD893a96169e8e5b45b1950314a16829
// 0xc0A89fAE92C5f47159ed143E2dE17501f7d94CC6
// 0xC2697585bCfcd63A2617A64Ab50CF960bc76d2A9
// 0xf51E6d536BEd7A48E151aE0aca0BDCAB8Cc01ce1
// 发送数额：100000000000000

// 06 部署的 WETH 合约地址
const addressWETH = '0xE5E4da5C05624459bdA2083e08b0AFf304c9fC52'; // WETH Contract
// WETH 的 ABI，不一定需要全部，选取要用到的就行
const abiWETH = [
  'function balanceOf(address) public view returns(uint)',
  'function transfer(address, uint) public returns (bool)',
];
// 声明 WETH 合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);

console.log('\n3. 读取一个地址的 ETH 和 WETH 余额');
//读取WETH余额
const balance0WETH = await contractWETH.balanceOf(wallet);
const balanceWETH = await contractWETH.balanceOf(wallets[19]);
console.log(`主地址 WETH 持仓: ${ethers.formatEther(balance0WETH)}`);
console.log(`派生某 WETH 持仓: ${ethers.formatEther(balanceWETH)}\n`);
//读取ETH余额
const balance0ETH = await provider.getBalance(wallet);
const balanceETH = await provider.getBalance(wallets[19]);
console.log(`主地址 ETH 持仓: ${ethers.formatEther(balance0ETH)}`);
console.log(`派生某 ETH 持仓: ${ethers.formatEther(balanceETH)}\n`);
// 3. 读取一个地址的 ETH 和 WETH 余额
// 主地址 WETH 持仓: 0.0091
// 派生某 WETH 持仓: 0.0002

// 主地址 ETH 持仓: 0.084344256072595935
// 派生某 ETH 持仓: 0.0019196542282271

console.log('\n4. 批量归集 20 个钱包的 WETH');
for (let i = 0; i < numWallet; i++) {
  const walletWithProvider = wallets[i].connect(provider);
  const connectedWETH = contractWETH.connect(walletWithProvider);
  // const connectedWETH = new ethers.Contract(
  //   addressWETH,
  //   abiWETH,
  //   walletWithProvider
  // );
  // console.log(connectedWETH);
  const tx = await connectedWETH.transfer(wallet.address, amount);
  await tx.wait();
  // console.log(tx);
  console.log(`第 ${i + 1} 个钱包 ${wallets[i].address} WETH 归集开始`);
}
console.log(`WETH 归集结束`);
// 4. 批量归集 20 个钱包的 WETH
// 第 1 个钱包 0x0d0c3c8015201C0c53f3Db1d5e8fcfD436b3f971 WETH 归集开始
// 第 2 个钱包 0xC9d004609BAdbbb94AD7Acd592B62B32Aaa7067d WETH 归集开始
// 第 3 个钱包 0x40acB63e3145f30185f1682F26D12C9De9B44133 WETH 归集开始
// 第 4 个钱包 0x75d052486D2Cd080bF9Bdc59Ce763f65Ee7406A7 WETH 归集开始
// 第 5 个钱包 0x02a2E6c1392F602C887E194aB2cB58490e000d16 WETH 归集开始
// 第 6 个钱包 0x610723f5d61D8519319FAE727776CfC1D2f95d2d WETH 归集开始
// 第 7 个钱包 0x5299e2888a5825c3D42BB575407E683fC556081b WETH 归集开始
// 第 8 个钱包 0x4b3db368023A38FBCf225eD7eDa7230AF413E4c9 WETH 归集开始
// 第 9 个钱包 0x86693D67595FA1ce4Aa607F9E692078FEE7E719f WETH 归集开始
// 第 10 个钱包 0xbf299e6863A2eC962f6220D156B96267f686eFE2 WETH 归集开始
// 第 11 个钱包 0xb5FFe4e8723e4C6762d804d21b329e7F7939D9bf WETH 归集开始
// 第 12 个钱包 0x4551F2A1B69F74FF448B0017f9495767f3546844 WETH 归集开始
// 第 13 个钱包 0x6722504425e97591982433e4Fc6cbF36ee38D0b1 WETH 归集开始
// 第 14 个钱包 0x0bf0EA2a63f766bd9903388Bc8ACe94d626Becdf WETH 归集开始
// 第 15 个钱包 0x23324199e6Bda1a75F16d7C5a7FEe90386795b43 WETH 归集开始
// 第 16 个钱包 0xDca3Bc867887a0C081E6849105595AFbf996D4Cc WETH 归集开始
// 第 17 个钱包 0x5fA46b08cD893a96169e8e5b45b1950314a16829 WETH 归集开始
// 第 18 个钱包 0xc0A89fAE92C5f47159ed143E2dE17501f7d94CC6 WETH 归集开始
// 第 19 个钱包 0xC2697585bCfcd63A2617A64Ab50CF960bc76d2A9 WETH 归集开始
// 第 20 个钱包 0xf51E6d536BEd7A48E151aE0aca0BDCAB8Cc01ce1 WETH 归集开始
// WETH 归集结束

console.log('\n5. 批量归集 20 个钱包的 ETH');
const txSendEth = {
  to: wallet.address,
  value: amount,
};
for (let i = 0; i < numWallet; i++) {
  const walletWithProvider = wallets[i].connect(provider);
  const tx = await walletWithProvider.sendTransaction(txSendEth);
  await tx.wait();
  console.log(`第 ${i + 1} 个钱包 ${walletWithProvider.address} ETH 归集开始`);
}
console.log('ETH 归集完毕');
// 5. 批量归集 20 个钱包的 ETH
// 第 1 个钱包 0x0d0c3c8015201C0c53f3Db1d5e8fcfD436b3f971 ETH 归集开始
// 第 2 个钱包 0xC9d004609BAdbbb94AD7Acd592B62B32Aaa7067d ETH 归集开始
// 第 3 个钱包 0x40acB63e3145f30185f1682F26D12C9De9B44133 ETH 归集开始
// 第 4 个钱包 0x75d052486D2Cd080bF9Bdc59Ce763f65Ee7406A7 ETH 归集开始
// 第 5 个钱包 0x02a2E6c1392F602C887E194aB2cB58490e000d16 ETH 归集开始
// 第 6 个钱包 0x610723f5d61D8519319FAE727776CfC1D2f95d2d ETH 归集开始
// 第 7 个钱包 0x5299e2888a5825c3D42BB575407E683fC556081b ETH 归集开始
// 第 8 个钱包 0x4b3db368023A38FBCf225eD7eDa7230AF413E4c9 ETH 归集开始
// 第 9 个钱包 0x86693D67595FA1ce4Aa607F9E692078FEE7E719f ETH 归集开始
// 第 10 个钱包 0xbf299e6863A2eC962f6220D156B96267f686eFE2 ETH 归集开始
// 第 11 个钱包 0xb5FFe4e8723e4C6762d804d21b329e7F7939D9bf ETH 归集开始
// 第 12 个钱包 0x4551F2A1B69F74FF448B0017f9495767f3546844 ETH 归集开始
// 第 13 个钱包 0x6722504425e97591982433e4Fc6cbF36ee38D0b1 ETH 归集开始
// 第 14 个钱包 0x0bf0EA2a63f766bd9903388Bc8ACe94d626Becdf ETH 归集开始
// 第 15 个钱包 0x23324199e6Bda1a75F16d7C5a7FEe90386795b43 ETH 归集开始
// 第 16 个钱包 0xDca3Bc867887a0C081E6849105595AFbf996D4Cc ETH 归集开始
// 第 17 个钱包 0x5fA46b08cD893a96169e8e5b45b1950314a16829 ETH 归集开始
// 第 18 个钱包 0xc0A89fAE92C5f47159ed143E2dE17501f7d94CC6 ETH 归集开始
// 第 19 个钱包 0xC2697585bCfcd63A2617A64Ab50CF960bc76d2A9 ETH 归集开始
// 第 20 个钱包 0xf51E6d536BEd7A48E151aE0aca0BDCAB8Cc01ce1 ETH 归集开始
// ETH 归集完毕

console.log('\n6. 读取一个地址在归集后的 ETH 和W ETH 余额');
// 读取 WETH 余额
const balance0WETHAfter = await contractWETH.balanceOf(wallet);
const balanceWETHAfter = await contractWETH.balanceOf(wallets[19]);
console.log(`主地址归集后 WETH 持仓: ${ethers.formatEther(balance0WETHAfter)}`);
console.log(
  `派生某归集后 WETH 持仓: ${ethers.formatEther(balanceWETHAfter)}\n`
);
// 读取 ETH 余额
const balance0ETHAfter = await provider.getBalance(wallet);
const balanceETHAfter = await provider.getBalance(wallets[19]);
console.log(`主地址归集后 ETH 持仓: ${ethers.formatEther(balance0ETHAfter)}`);
console.log(`派生某归集后 ETH 持仓: ${ethers.formatEther(balanceETHAfter)}\n`);
// 6. 读取一个地址在归集后的 ETH 和W ETH 余额
// 主地址归集后 WETH 持仓: 0.0111
// 派生某归集后 WETH 持仓: 0.0001

// 主地址归集后 ETH 持仓: 0.086344256072595935
// 派生某归集后 ETH 持仓: 0.00158823443899645
