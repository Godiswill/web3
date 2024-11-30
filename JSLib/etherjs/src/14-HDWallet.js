/**
 * 批量生成 HD 钱包（Hierarchical Deterministic Wallet，多层确定性钱包）
 *
 * 钱包相关规范：BIP32、BIP44、BIP39
 * BIP32 之前，用户一个地址对应一个私钥，N 个地址需要保持 N 条私钥，管理麻烦。
 * - BIP32 提出可以用一个随机数生成一个主私钥，主私钥可以派生出多个字私钥，子私钥可以派生孙私钥，
 *   私钥推导出公钥，公钥生成钱包地址。主私钥根据衍生路径（例如 "m/0/0/1"）可以派生出分层次、确定性私钥。
 *   某一子私钥被泄漏，只会影响子私钥的资产，因为它无法反向推导出主私钥。
 *   也就是说，一旦主私钥被泄漏，那么就能掌握主、子、孙等所有的资产。
 * - BIP44 提供了一套衍生生路径规范：
 *   m / purpose' / coin_type' / account' / change / address_index
 *    m: 固定为"m"
 *    purpose：固定为"44"
 *    coin_type：代币类型，比特币主网为0，比特币测试网为1，以太坊主网为60
 *    account：账户索引，从0开始。
 *    change：是否为外部链，0为外部链，1为内部链，一般填0.
 *    address_index：地址索引，从0开始，想生成新地址就把这里改为1，2，3。
 *  以太坊的默认衍生路径为 "m/44'/60'/0'/0/0"
 * - BIP39 让用户用可记忆的一段助记词来保管私钥，而不是一串 16 进制串。目前是主流钱包应用规范。
 * // 私钥
 * 0x813f8f0a4df26f6455814fdd07dd2ab2d0e2d13f4d2f3c66e7fd9e3856060f89
 * // 24个 助记词，常见的是 12 个
 * air organ twist rule prison symptom
 * jazz cheap rather dizzy verb glare
 * jeans orbit weapon universe require tired
 * sing casino business anxiety seminar hunt
 */

import { ethers } from 'ethers';

// 生成 32 位随机数
const bytes32Random = ethers.randomBytes(32);
console.log(`1. 生成 32 位随机数：${bytes32Random}`);
// 随机数生成助记词
const mnemonic = ethers.Mnemonic.entropyToPhrase(bytes32Random);
console.log(`2. 随机数生成助记词：${mnemonic}`);
// 创建HD基钱包
// 基路径："m / purpose' / coin_type' / account' / change"
const basePath = "44'/60'/0'/0";
const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath);
console.log(`3. 生成的主私钥对象：`);
console.log(baseWallet);
// 1. 生成 32 位随机数：89,83,110,43,56,126,206,101,196,153,131,145,246,223,151,221,181,43,114,229,250,193,215,223,44,104,23,241,167,164,69,74
// 2. 随机数生成助记词：flock opinion member ill undo cream bar corn music report tourist rocket famous ride obey flag style west borrow copper bounce split benefit figure
// 3. 生成的主私钥对象：
// HDNodeWallet {
//   provider: null,
//   address: '0x2D3521ba8F4be401fEE0675FC1953D18816F6543',
//   publicKey: '0x03d7fcf90cbf7649e8efd59a4fbc5d1a4dd62f55199580c84cf389a0005715ea3c',
//   fingerprint: '0x33875315',
//   parentFingerprint: '0x76b5d5b4',
//   mnemonic: Mnemonic {
//     phrase: 'flock opinion member ill undo cream bar corn music report tourist rocket famous ride obey flag style west borrow copper bounce split benefit figure',
//     password: "44'/60'/0'/0",
//     wordlist: LangEn { locale: 'en' },
//     entropy: '0x59536e2b387ece65c4998391f6df97ddb52b72e5fac1d7df2c6817f1a7a4454a'
//   },
//   chainCode: '0x7012025a4ff985568502b6fa307a23505a16cb49773987d3c077543526d29458',
//   path: "m/44'/60'/0'/0/0",
//   index: 0,
//   depth: 5
// }
const numWallet = 20;
let wallets = [];
console.log('批量生成 20 个钱包：');
for (let i = 0; i < numWallet; i++) {
  const baseWalletNew = baseWallet.derivePath(i.toString());
  console.log(` 第 ${i + 1} 个钱包地址：${baseWalletNew.address}`);
  wallets.push(baseWalletNew);
}
// 批量生成 20 个钱包：
//  第 1 个钱包地址：0xff53312BfDB5eB3972F24348214c04f6Efdcd43F
//  第 2 个钱包地址：0xc56e6d67BD619743403df382d3bf5f5df3E6bAA8
//  第 3 个钱包地址：0x5014b5DE3636b7C4e1677df14555ECB9AD0a4E63
//  第 4 个钱包地址：0x5bC892F5FaE6ebb3Aa4ea1F49189A2d2cca60F72
//  第 5 个钱包地址：0xc6555F32eC371f05CD4bF75862281a2F4673188D
//  第 6 个钱包地址：0x6a7CEFbC779F8336CC5Ff96eBCF172795f98D4B7
//  第 7 个钱包地址：0x9f4bB3434B9dE80Ac0d7344E94126de2a3eb22CE
//  第 8 个钱包地址：0x8638f56Dc54EA2Ad8506f04a97Ab098241cA2d36
//  第 9 个钱包地址：0x8Ed22Ed5d60B4f748ed401bC19e64C61AE60aa70
//  第 10 个钱包地址：0xf7A9A380112410c5De3D2c5592a2F69120eA9cAD
//  第 11 个钱包地址：0xDB9Ec6401E6E113273d25F59E69Da24659e2892b
//  第 12 个钱包地址：0x0Facccad6D9d40b7341685A1FbfC047EffBa2cEA
//  第 13 个钱包地址：0x00464AC47674E19c890cfcdb8Ecb64733B9ad844
//  第 14 个钱包地址：0xefEBE15d54DdB2a20bE560fB0288225EC564b07D
//  第 15 个钱包地址：0x571b86a228889D4Dc7A3ED659b2A2Db680DFA804
//  第 16 个钱包地址：0xB5F0E7F37db1F0C2466F9a9b7cAEC72821c96Fa8
//  第 17 个钱包地址：0x6C4191f5424037c311044F8042ca645547bD2dC7
//  第 18 个钱包地址：0xdb86E25960c4940b6380ed8089F470cE13BD201b
//  第 19 个钱包地址：0xB2425B03264fc1Fd3fb85c3d7d686286f0a7A6B4
//  第 20 个钱包地址：0x26524aBE6F8C891D5c1537cc434b0Df9ca7D365e

// 模拟钱包导入地址的过程
const wallet = ethers.Wallet.fromPhrase(mnemonic);
console.log('通过助记词创建钱包');
console.log(wallet);
// 通过助记词创建钱包
// HDNodeWallet {
//   provider: null,
//   address: '0xf9aC8f831ebB699D166514EC663a64Fb7E9F588f',
//   publicKey: '0x034803b54a09718e029f54ebc63548057ac69bec83a6470b09da4e7cd91582f645',
//   fingerprint: '0xe765465d',
//   parentFingerprint: '0x04caa949',
//   mnemonic: Mnemonic {
//     phrase: 'flock opinion member ill undo cream bar corn music report tourist rocket famous ride obey flag style west borrow copper bounce split benefit figure',
//     password: '',
//     wordlist: LangEn { locale: 'en' },
//     entropy: '0x59536e2b387ece65c4998391f6df97ddb52b72e5fac1d7df2c6817f1a7a4454a'
//   },
//   chainCode: '0x504f91754fc142bd0bc4c03de89800896c1c2536f36e2f47cd83550bd417c0bb',
//   path: "m/44'/60'/0'/0/0",
//   index: 0,
//   depth: 5
// }

// 一般我们用的钱包会要求你输入一个密码，用来加密本地加密
const pwd = 'Your password';
const json = await wallet.encrypt(pwd);
console.log('钱包加密 json：');
console.log(json);
// 钱包加密 json：
// {"address":"f9ac8f831ebb699d166514ec663a64fb7e9f588f","id":"e93ca028-2950-46d5-9544-5f462ceebac3","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"2f87a7af98bb3134c5bbaf904702c22d"},"ciphertext":"99bcd52eec1a75a2598bb5cca1297fdd3fd9dd59498216750b6117f99c5f6808","kdf":"scrypt","kdfparams":{"salt":"a5096d83ad548d64a7e07d6b0943f1b91144a24b4a740113084bd00cfdb32d99","n":131072,"dklen":32,"p":1,"r":8},"mac":"ef741c8a1e8511c55108cea045bdae6f9ecf7ee21fe20b20f1b9ce5b162c7b26"},"x-ethers":{"client":"ethers/6.13.4","gethFilename":"UTC--2024-11-30T07-47-01.0Z--f9ac8f831ebb699d166514ec663a64fb7e9f588f","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"d058d0662951f8db7259366d36685914","mnemonicCiphertext":"d19a2d8957539f7ab52af649f5a99ae151086cb994096609b190525fd4ab675c","version":"0.1"}}

// 例如我们使用钱包插件时，会锁定，需要你输入密码解锁
const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
console.log('从加密 json 读取钱包：');
console.log(wallet2);
// 从加密 json 读取钱包：
// HDNodeWallet {
//   provider: null,
//   address: '0xf9aC8f831ebB699D166514EC663a64Fb7E9F588f',
//   publicKey: '0x034803b54a09718e029f54ebc63548057ac69bec83a6470b09da4e7cd91582f645',
//   fingerprint: '0xe765465d',
//   parentFingerprint: '0x04caa949',
//   mnemonic: Mnemonic {
//     phrase: 'flock opinion member ill undo cream bar corn music report tourist rocket famous ride obey flag style west borrow copper bounce split benefit figure',
//     password: '',
//     wordlist: LangEn { locale: 'en' },
//     entropy: '0x59536e2b387ece65c4998391f6df97ddb52b72e5fac1d7df2c6817f1a7a4454a'
//   },
//   chainCode: '0x504f91754fc142bd0bc4c03de89800896c1c2536f36e2f47cd83550bd417c0bb',
//   path: "m/44'/60'/0'/0/0",
//   index: 0,
//   depth: 5
// }
