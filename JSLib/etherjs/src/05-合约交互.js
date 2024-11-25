/**
 * 在 Sepolia 测试网约 WETH 合约交互
 * 1. 存入 0.001 ETH 换取 0.001 WETH
 * 2. 把 0.001 WETH 发送给 Vitalik
 */
import { ethers } from 'ethers';

// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.api.onfinality.io/public';
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

const privateKey =
  '0xdf05966ab50e02a0c9b96a728ded9e646c2a324a8756bd0a2ef259902f72930d';
const wallet = new ethers.Wallet(privateKey, provider);

// WETH的ABI
const abiWETH = [
  'function balanceOf(address) public view returns(uint)', // 查询 WETH 余额
  'function deposit() public payable', // ETH 存入合约获得 WETH
  'function transfer(address, uint) public returns (bool)', // 转账
  'function withdraw(uint) public', // 用 WETH 换取 ETH
];

// WETH合约地址（Sepolia 测试网）
const addressWETH = '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa'; // WETH Contract

// 声明可写合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);
// 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

const address = await wallet.getAddress();
// 读取WETH合约的链上信息（WETH abi）
console.log('\n1. 读取 WETH 余额');
const balanceWETH = await contractWETH.balanceOf(address);
console.log(`存款前 WETH 持仓: ${ethers.formatEther(balanceWETH)}\n`);
// 1. 读取 WETH 余额
// 存款前 WETH 持仓: 0.0

console.log('\n2. 调用 deposit() 函数，存入0.001 ETH');
// 发起交易
// 对于更改状态的调用，不知道数据何时上链，所以不会返回方法的返回值，只会返回这次交易的信息。
// 只有对 view/pure 函数的调用例如 balanceOf ，会获取函数返回值。
// 需要记录交易过程的数据信息，需要借助 event
const tx = await contractWETH.deposit({
  value: ethers.parseEther('0.001'),
});
// 等待交易上链
await tx.wait();
console.log(`交易详情：`);
console.log(tx);
const balanceWETH_deposit = await contractWETH.balanceOf(address);
console.log(`存款后 WETH 持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`);
// 2. 调用 deposit() 函数，存入0.001 ETH
// 交易详情：
// ContractTransactionResponse {
//   provider: JsonRpcProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0xb8380a5096249cb9f7a38a81ee61b0b0fb7e94c1a5b214130f6a53dace964964',
//   type: 2,
//   to: '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa',
//   from: '0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37',
//   nonce: 4,
//   gasLimit: 52933n,
//   gasPrice: undefined,
//   maxPriorityFeePerGas: 1000000n,
//   maxFeePerGas: 15411822112n,
//   maxFeePerBlobGas: null,
//   data: '0xd0e30db0',
//   value: 1000000000000000n,
//   chainId: 11155111n,
//   signature: Signature { r: "0x7a3ec2f308c3c1a27d5c0fd154013864767bb08a795172a5efa1e5f5a226cb9f", s: "0x24e0da6e53f5d03495af6a74f42aa319a8ba47a97bc9fb5fe1c7b4c4cf1634bb", yParity: 1, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null
// }
// 存款后 WETH 持仓: 0.001

console.log('\n3. 调用 transfer() 函数，给 vitalik 转账 0.001 WETH');
// 发起交易
const tx2 = await contractWETH.transfer(
  'vitalik.eth',
  ethers.parseEther('0.001')
);
// 等待交易上链
await tx2.wait();
console.log(`交易详情：`);
console.log(tx2);
const balanceWETH_transfer = await contractWETH.balanceOf(address);
console.log(`转账后 WETH 持仓: ${ethers.formatEther(balanceWETH_transfer)}\n`);
// 3. 调用 transfer() 函数，给 vitalik 转账 0.001 WETH
// 交易详情：
// ContractTransactionResponse {
//   provider: JsonRpcProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0x3364a12c0e7a22efbb2554feaabcd38035bd1c09e128649444a14ee4af650288',
//   type: 2,
//   to: '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa',
//   from: '0x3cf9a3265E00cfBda31bcFb90a11a684861d0E37',
//   nonce: 5,
//   gasLimit: 34850n,
//   gasPrice: undefined,
//   maxPriorityFeePerGas: 1000000n,
//   maxFeePerGas: 14600153762n,
//   maxFeePerBlobGas: null,
//   data: '0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000038d7ea4c68000',
//   value: 0n,
//   chainId: 11155111n,
//   signature: Signature { r: "0x1bdf6ddb790a7b81ea2ae6a3e99864b244bb83b3f198785f7049cde878bbf76d", s: "0x5d679f606393dee4b1dacbbedbcb8935cdb10490aa99c2d161f01ee553116752", yParity: 0, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null
// }
// 转账后 WETH 持仓: 0.0
