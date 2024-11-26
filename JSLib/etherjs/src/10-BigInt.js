/**
 * BigInt 单位换算
 * 以太坊的基础数据高达 2**256 - 1，会造成 javaScript 运算溢出
 * ethers.js 使用了 ES2020 原生的 BigInt 类型来进行数学运算
 * formatUnits 数字转字符显示
 * parseUnits  字符解析成数字
 */

import { ethers } from 'ethers';

// getBigInt 转换 string、number -> bigInt
const oneGwei = ethers.getBigInt('1000000000'); // 从十进制字符串生成
console.log(oneGwei);
console.log(ethers.getBigInt('0x3b9aca00')); // 从hex字符串生成
console.log(ethers.getBigInt(1000000000)); // 从数字生成
// 原文中：不能从js最大的安全整数之外的数字生成BigNumber，下面代码会报错
// 不知道是 ethers 还是 node v21.5 的缘故，运行正常，务必多做测试谨慎使用
console.log(ethers.getBigInt(Number.MAX_SAFE_INTEGER));
console.log('js中最大安全整数：', Number.MAX_SAFE_INTEGER);
console.log('js中最大安全整数 + 1：', Number.MAX_SAFE_INTEGER + 1);
// 1000000000n
// 1000000000n
// 1000000000n
// 9007199254740991n
// js中最大安全整数： 9007199254740991
// js中最大安全整数 + 1： 9007199254740992

// 运算
console.log('加法：', oneGwei + 1n);
console.log('减法：', oneGwei - 1n);
console.log('乘法：', oneGwei * 2n);
console.log('除法：', oneGwei / 2n);
// 比较
console.log('是否相等：', oneGwei == 1000000000n);
// 加法： 1000000001n
// 减法： 999999999n
// 乘法： 2000000000n
// 除法： 500000000n
// 是否相等： true

// 单位换算
// Name  Decimals
// wei    0
// kwei   3
// mwei   6
// gwei   9
// szabo  12
// finney 15
// ether  18
// 常用的 wei、gwei、ether，
// 例如交易都得转化为 wei； gas 费单位一般是 gwei；钱包资产用 ether 体现较多

//代码参考：https://docs.ethers.org/v6/api/utils/#about-units
console.group('\n2. 格式化：小单位转大单位，formatUnits');
console.log(ethers.formatUnits(oneGwei, 0));
// '1000000000'
console.log(ethers.formatUnits(oneGwei, 'gwei'));
// '1.0'
console.log(ethers.formatUnits(oneGwei, 9));
// '1.0'
console.log(ethers.formatUnits(oneGwei, 'ether'));
// `0.000000001`
console.log(ethers.formatUnits(1000000000, 'gwei'));
// '1.0'
console.log(ethers.formatEther(oneGwei));
// `0.000000001` 等同于formatUnits(value, "ether")
console.groupEnd();
// 2. 格式化：小单位转大单位，formatUnits
//   1000000000
//   1.0
//   1.0
//   0.000000001
//   1.0
//   0.000000001

// 3. 解析：大单位转小单位
// 例如将ether转换为wei：parseUnits(变量, 单位),parseUnits默认单位是 ether
// 代码参考：https://docs.ethers.org/v6/api/utils/#about-units
console.group('\n3. 解析：大单位转小单位，parseUnits');
console.log(ethers.parseUnits('1.0').toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits('1.0', 'ether').toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits('1.0', 18).toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits('1.0', 'gwei').toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseUnits('1.0', 9).toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseEther('1.0').toString());
// { BigNumber: "1000000000000000000" } 等同于parseUnits(value, "ether")
console.groupEnd();
// 3. 解析：大单位转小单位，parseUnits
//   1000000000000000000
//   1000000000000000000
//   1000000000000000000
//   1000000000
//   1000000000
//   1000000000000000000
