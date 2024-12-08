/**
 * 12 章中，学到如何利用 ERC165 来识别合约是否是符合 ERC721 规范
 * 由于 ERC20 早于 ERC165，所以不能用来识别 ERC20。
 * 识别 ERC20 原理: 判断合约是否拥有 transfer(address, uint256)、totalSupply() 函数
 *  - 合约是以字节码的形式存储与链上，函数也被编码成函数选择器
 *  - 也即：检索合约字节码是否拥有以下两个选择器：
 *    1. a9059cbb : bytes4(keccak("transfer(address, uint256)"))
 *       ERC20标准中只有 transfer(address, uint256) 不包含在 ERC72、ERC1155 和 ERC777标准中。
 *       因此如果一个合约包含 transfer(address, uint256) 的选择器，就能确定它是 ERC20 代币合约
 *    2. 18160ddd : bytes4(keccak("totalSupply()"))
 *       额外检测 totalSupply() 是为了防止选择器碰撞。
 *       一串随机的字节码可能和 transfer(address, uint256) 的选择器（4字节）相同
 * 低级调用
 * PS: address(xx).call(abi.encodeWithSelector(selector, param1, param...));
 *
 */
import { ethers } from 'ethers';

const provider = ethers.getDefaultProvider();

async function erc20Checker(addr) {
  const bytecode = await provider.getCode(addr);
  return bytecode?.includes('a9059cbb') && bytecode?.includes('18160ddd');
}

// DAI address (mainnet)
const daiAddr = '0x6b175474e89094c44da98b954eedeac495271d0f';
// BAYC address (mainnet)
const baycAddr = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';

const main = async () => {
  // 检查DAI合约是否为ERC20
  const isDaiERC20 = await erc20Checker(daiAddr);
  console.log(`1. Is DAI a ERC20 contract: ${isDaiERC20}`);

  // 检查BAYC合约是否为ERC20
  const isBaycERC20 = await erc20Checker(baycAddr);
  console.log(`2. Is BAYC a ERC20 contract: ${isBaycERC20}`);

  // 1. Is DAI a ERC20 contract: true
  // 2. Is BAYC a ERC20 contract: false
};

main();
