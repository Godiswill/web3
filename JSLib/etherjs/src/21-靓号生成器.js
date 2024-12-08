/**
 * 区块链地址都是离线生成的，生成规则只要符合特定区块链的规范，就可以签名交易。
 * 有人会担忧生成地址会不会冲突而被别人拿到同一个地址，或被人暴力不断生成破解。
 * 只要生成地址的随机数够大够随机，一般概率比较低，为 1 / (2^256).
 * 当然 知名做市商 Wintermute 被盗 $1.6亿 的靓号地址，原因就是使用了一个叫
 * Profinity 的靓号生成器来生成地址，这个生成器的随机数种子用了 32 位长度的，
 * 也就是 2^32 可能性，可以被暴力破解，便利 2^32 个种子去生成地址，
 * 跟目标地址去匹配，这样就可以拿到该地址的私钥了。
 *
 * 即然获取地址不需要费用、不需要第三方认证，那么我们可以挑选靓号，像 888888 车牌一样。
 * 原理：不停随机生成地址，用靓号正则表达式匹配，符合靓号规则的，记录下助记词或私钥即可。
 */
import { ethers } from 'ethers';

// 生成 000 开头的靓号地址
// let wallet;
// const regex = /^0x000.*$/;
// let isValid = false;
// while (!isValid) {
//   wallet = ethers.Wallet.createRandom();
//   isValid = regex.test(wallet.address);
// }
// 打印靓号地址与私钥
// console.log(`靓号地址：${wallet.address}`);
// console.log(`靓号私钥：${wallet.privateKey}`);
// 等待几十秒
// 靓号地址：0x000948131772D94E2C58DdA0E6c7ce0fcC6A18C4
// 靓号私钥：0x4b5651c6c9c3fc309b74ee5792ba60198b70c1a9482111c8c119e019b4ff149c

// 批量生成地址，例如
// 0x001.。。
// 0x002.。。
// 0x003.。。
// 00开头且有序的 5 个地址
let cnt = 5;
const regArr = [];
const result = [];
for (let i = 1; i <= cnt; i++) {
  const paddedIndex = i.toString().padStart(3, '0');
  regArr.push(new RegExp(`^0x${paddedIndex}.*$`));
}
while (cnt) {
  const wallet = ethers.Wallet.createRandom();
  const index = regArr.findIndex(
    (reg, i) => !result[i] && reg.test(wallet.address)
  );
  if (index !== -1) {
    result[index] = `${wallet.address}:${wallet.privateKey}`;
    cnt--;
    console.log(`${index}: ${result[index]}`);
  }
}
console.log(result);

// 4: 0x005F0a2e489C4cddC3393AdfcCcda3f09a088433:0x448bf8b4f43c528ea9f95a18ddb5d9336a405ba50f6321294c876826491e3aa0
// 1: 0x002EDc6C24CB28Cf979c410cD695735f028049a7:0x16569829f8a02208ce8a166b9f74d0e7e1daea7676c44b29e50f2d087c0b9e53
// 3: 0x004ee93a71bA87a00114f9b6BCE68E04cca3E9Af:0x3f7b2a4d1c2eec0bcef33d8469a14c2e076133f42416328ab0e1bff58599d6d3
// 0: 0x00170c7CD7CeB1cCf4fEe04a1d32537117cD0FD8:0x1a152ea15870930cf0520ddf7dc8c093c42cc156a55bc714da5677ba57b23414
// 2: 0x00390B277f8946e26045b35074a12B60D5ad22cC:0x19097a228cfb3cd2b81985dfc449b913b09ea5c2aff4bc943f0c68d989f6d98a
// [
//   '0x00170c7CD7CeB1cCf4fEe04a1d32537117cD0FD8:0x1a152ea15870930cf0520ddf7dc8c093c42cc156a55bc714da5677ba57b23414',
//   '0x002EDc6C24CB28Cf979c410cD695735f028049a7:0x16569829f8a02208ce8a166b9f74d0e7e1daea7676c44b29e50f2d087c0b9e53',
//   '0x00390B277f8946e26045b35074a12B60D5ad22cC:0x19097a228cfb3cd2b81985dfc449b913b09ea5c2aff4bc943f0c68d989f6d98a',
//   '0x004ee93a71bA87a00114f9b6BCE68E04cca3E9Af:0x3f7b2a4d1c2eec0bcef33d8469a14c2e076133f42416328ab0e1bff58599d6d3',
//   '0x005F0a2e489C4cddC3393AdfcCcda3f09a088433:0x448bf8b4f43c528ea9f95a18ddb5d9336a405ba50f6321294c876826491e3aa0'
// ]