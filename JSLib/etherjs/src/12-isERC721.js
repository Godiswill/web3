/**
 * 如何识别合约是否符合 ERC721 规范
 * ERC721：https://eips.ethereum.org/EIPS/eip-721
 * ERC721 只是定义了一套接口规范，只要合约实现了规范里的接口集合
 * 都可以说是符合 ERC721 合约，具体实现可以因人而异。
 *
 * ERC721 规范同时必须实现 ERC165 规范
 * ERC165 https://eips.ethereum.org/EIPS/eip-165
 * ERC165 要求实现 supportsInterface 方法，该方法提供识别
 * 合约是符合 ERC165 或 ERC721 方法
 * 该方法接受一个参数 interfaceID，例如
 * ERC165 的 interfaceID 是 0x01ffc9a7
 * ERC721 的 interfaceID 0x80ac58cd
 *
 * interfaceID 就是合约所有函数 hash 取前 4 字节（bytes4）异或而来
 * 例如 ERC165 只有一个函数 supportsInterface：
 * solidity 两种实现
 *  - bytes4(keccak256('supportsInterface(bytes4)'))
 *  - this.supportsInterface.selector
 *
 * 同理 ERC721 所必须实现的函数哈希异或 == 0x80ac58cd
 *  - this.balanceOf.selector ^ this.ownerOf.selector ^...
 * 
 * ERC721、ERC1155 都支持了 ERC165 的标准，均可以用此方法识别
 * ERC20 不支持
 */

import { ethers } from 'ethers';
const provider = ethers.getDefaultProvider();

// 合约abi
const abiERC721 = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function supportsInterface(bytes4) public view returns(bool)',
];
// ERC721的合约地址，这里用的BAYC
const addressBAYC = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';
// 创建ERC721合约实例
const contractERC721 = new ethers.Contract(addressBAYC, abiERC721, provider);

// 1. 读取ERC721合约的链上信息
const nameERC721 = await contractERC721.name();
const symbolERC721 = await contractERC721.symbol();
console.log('\n1. 读取ERC721合约信息');
console.log(`合约地址: ${addressBAYC}`);
console.log(`名称: ${nameERC721}`);
console.log(`代号: ${symbolERC721}`);
// 1. 读取ERC721合约信息
// 合约地址: 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
// 名称: BoredApeYachtClub
// 代号: BAYC

// 2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准
// ERC721接口的ERC165 identifier
const selectorERC721 = '0x80ac58cd';
const isERC721 = await contractERC721.supportsInterface(selectorERC721);
console.log('\n2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准');
console.log(`合约是否为ERC721标准: ${isERC721}`);
// 2. 利用ERC165的supportsInterface，确定合约是否为ERC721标准
// 合约是否为ERC721标准: true

