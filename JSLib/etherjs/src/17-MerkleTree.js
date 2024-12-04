/**
 * Merkle Tree 默克尔树 是区块链重要的加密技术，
 * 被比特币或以太坊等区块链广泛使用，它是一种自下而上
 * 构建的加密树，每个叶子结点是数据的 Hash 值，
 * 每个父节点是两个子节点的 Hash 值，最终有一个根节点。
 * 它可以用来对大型数据的内容进行有效、安全的验证。
 * 例如验证某个数据是否在默克尔树中，只需要该数据的 Hash 值
 * 和 logN 个验证 Hash，组成最终的根 Hash 跟原来的根 Hash 比对即可。
 * NFT 白名单 mint 机制经常用到，由于 gas 或链上存储费用高昂，
 * 如果把每个白名单都记录在链上太过于昂贵，有了默克尔树，
 * 链上只需存储 Root Hash 的值即可，链下通过提交需要验证的白名单和
 * 验证节点给链上来还原 Root Hash，然后跟链上对比即可。
 */

// npm install merkletreejs
import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';

// 1. 生成merkle tree
console.log('\n1. 生成merkle tree');
// 白名单地址
const tokens = [
  '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
  '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
  '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
  '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
];
// leaf, merkletree, proof
const leaf = tokens.map((x) => ethers.keccak256(x));
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true });
const proof = merkletree.getHexProof(leaf[0]);
const root = merkletree.getHexRoot();
console.log('Leaf:');
console.log(leaf);
console.log('\nMerkleTree:');
console.log(merkletree.toString());
console.log('\nProof:');
console.log(proof);
console.log('\nRoot:');
console.log(root);
// 1. 生成merkle tree
// Leaf:
// [
//   '0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229',
//   '0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb',
//   '0x04a10bfd00977f54cc3450c9b25c9b3a502a089eba0097ba35fc33c4ea5fcb54',
//   '0xdfbe3e504ac4e35541bebad4d0e7574668e16fefa26cd4172f93e18b59ce9486'
// ]

// MerkleTree:
// └─ eeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097
//    ├─ 9d997719c0a5b5f6db9b8ac69a988be57cf324cb9fffd51dc2c37544bb520d65
//    │  ├─ 5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229
//    │  └─ 999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb
//    └─ 4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c
//       ├─ 04a10bfd00977f54cc3450c9b25c9b3a502a089eba0097ba35fc33c4ea5fcb54
//       └─ dfbe3e504ac4e35541bebad4d0e7574668e16fefa26cd4172f93e18b59ce9486

// Proof:
// [
//   '0x999bf57501565dbd2fdcea36efa2b9aef8340a8901e3459f4a4c926275d36cdb',
//   '0x4726e4102af77216b09ccd94f40daa10531c87c4d60bba7f3b3faf5ff9f19b3c'
// ]

// Root:
// 0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097

// 注意公共节点可能不更新或失效
// https://chainlist.org/chain/11155111 可以替换最新的可以接口用来测试
const SEPOLIA_URL = 'https://eth-sepolia.api.onfinality.io/public';
const provider = new ethers.JsonRpcProvider(SEPOLIA_URL);

console.log('\n2. 助记词创建 HD 钱包');
const mnemonic =
  'metal cereal clump disagree sight recall catch they fire diagram swallow nurse';
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
const wallet = new ethers.Wallet(hdNode.privateKey, provider);

// 3. 创建合约工厂
// NFT的abi
const abi = [
  'function merkleRoot() view returns (bytes32)',
  'function setRoot(bytes32) public',
  'function isWhitelist(address, bytes32[] calldata) public view returns (bool)',
];
// 合约字节码，在 remix 中，你可以在两个地方找到 Bytecode
// i. 部署面板的 Bytecode 按钮
// ii. 文件面板 artifact 文件夹下与合约同名的json文件中
// 里面 "object" 字段对应的数据就是 Bytecode，挺长的，
// "object": "608060405234801560...
const bytecode =
  '6080604052348015600e575f80fd5b506105418061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061003f575f3560e01c80632eb4a7ab146100435780639d1c16d614610061578063dab5f34014610091575b5f80fd5b61004b6100ad565b6040516100589190610246565b60405180910390f35b61007b60048036038101906100769190610322565b6100b2565b6040516100889190610399565b60405180910390f35b6100ab60048036038101906100a691906103dc565b610183565b005b5f5481565b5f805f1b5f54036100f8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ef90610461565b60405180910390fd5b61016a8383808060200260200160405190810160405280939291908181526020018383602002808284375f81840152601f19601f820116905080830192505050505050505f548660405160200161014f91906104c4565b6040516020818303038152906040528051906020012061018c565b15610178576001905061017c565b5f90505b9392505050565b805f8190555050565b5f8261019885846101a2565b1490509392505050565b5f808290505f5b84518110156101e5576101d6828683815181106101c9576101c86104de565b5b60200260200101516101f0565b915080806001019150506101a9565b508091505092915050565b5f81831061020757610202828461021a565b610212565b610211838361021a565b5b905092915050565b5f825f528160205260405f20905092915050565b5f819050919050565b6102408161022e565b82525050565b5f6020820190506102595f830184610237565b92915050565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61029082610267565b9050919050565b6102a081610286565b81146102aa575f80fd5b50565b5f813590506102bb81610297565b92915050565b5f80fd5b5f80fd5b5f80fd5b5f8083601f8401126102e2576102e16102c1565b5b8235905067ffffffffffffffff8111156102ff576102fe6102c5565b5b60208301915083602082028301111561031b5761031a6102c9565b5b9250929050565b5f805f604084860312156103395761033861025f565b5b5f610346868287016102ad565b935050602084013567ffffffffffffffff81111561036757610366610263565b5b610373868287016102cd565b92509250509250925092565b5f8115159050919050565b6103938161037f565b82525050565b5f6020820190506103ac5f83018461038a565b92915050565b6103bb8161022e565b81146103c5575f80fd5b50565b5f813590506103d6816103b2565b92915050565b5f602082840312156103f1576103f061025f565b5b5f6103fe848285016103c8565b91505092915050565b5f82825260208201905092915050565b7f526f6f742048617368206973206e6f74207365740000000000000000000000005f82015250565b5f61044b601483610407565b915061045682610417565b602082019050919050565b5f6020820190508181035f8301526104788161043f565b9050919050565b5f8160601b9050919050565b5f6104958261047f565b9050919050565b5f6104a68261048b565b9050919050565b6104be6104b982610286565b61049c565b82525050565b5f6104cf82846104ad565b60148201915081905092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffdfea2646970667358221220d248a4ba082cd4d7aa4d56987c44edca789bbe8d222fa2f8c43d3627f81c5d4064736f6c634300081a0033';
const factory = new ethers.ContractFactory(abi, bytecode, wallet);

console.log('\n3. 利用 contractFactory 部署合约');
// 部署合约，填入constructor的参数
const contract = await factory.deploy();
console.log(`合约地址: ${contract.target}`);
console.log('等待合约部署上链');
await contract.waitForDeployment();
console.log('合约已上链');
// 3. 利用 contractFactory 部署合约
// 合约地址: 0x5FaDd81F71aCD217F106d8Bd78312ccD1A72aa9F
// 等待合约部署上链
// 合约已上链

console.log('\n4. 调用 setRoot() 函数');
const tx = await contract.setRoot(
  '0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097'
);
await tx.wait();
console.log(`Root Hash: ${await contract.merkleRoot()}`);
// 4. 调用 setRoot() 函数
// Root Hash: 0xeeefd63003e0e702cb41cd0043015a6e26ddb38073cc6ffeb0ba3e808ba8c097

console.log('\n5. 验证');
console.log(
  `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 是否在 Merkle Tree 中: ${await contract.isWhitelist(
    tokens[0],
    proof
  )}`
);
console.log(
  `0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2（但用了错误的验证节点） 是否在 Merkle Tree 中: ${await contract.isWhitelist(
    tokens[1],
    proof
  )}`
);
// 5. 验证
// 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 是否在 Merkle Tree 中: true
// 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2（但用了错误的验证节点） 是否在 Merkle Tree 中: false
