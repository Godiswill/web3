# web3 学习之路
[Web3 学习图谱 - 登链社区](https://learnblockchain.cn/maps/Roadmap)

[区块链图谱](https://roadmap.sh/blockchain)

[登链社区资源集合](https://learnblockchain.cn/manuals?page=1)

[TheWeb3 - github](https://github.com/the-web3)：宝藏仓库，教程很多

## 以太坊 EVM 架构
### 语言学习

#### solidity
[Solidity 英文官网](https://docs.soliditylang.org/)

[Solidity 中文文档 - 登链](https://learnblockchain.cn/docs/solidity/)

[Solidity Lang](https://docs.soliditylang.org/zh/v0.8.20/)

[Solidity - 崔棉大师视频课程](https://www.youtube.com/watch?v=XlJwBTIps_I&list=PLV16oVzL15MS-Zw8a3eEOADwbHhm8GrMp&ab_channel=%E5%B4%94%E6%A3%89%E5%A4%A7%E5%B8%88%E5%B8%A6%E4%BD%A0%E7%8E%A9%E8%BD%ACWeb3.0%E8%B5%A2%E5%9C%A8%E5%8C%BA%E5%9D%97%E9%93%BE) ：推荐，语速很流畅不啰嗦，逻辑清晰，边看边跟着写代码并执行。

### DApp 源码学习

[DApp Learning - Github](https://github.com/Dapp-Learning-DAO/Dapp-Learning/blob/main/README-CN.md)

#### 库合约或 Demo

[MintCoin崔棉大师的花式发币法](https://github.com/Fankouzu/MintCoin)

[Solidity by Example](https://solidity-by-example.org/)

[OpenZeppelin](https://docs.openzeppelin.com/)

[Forsage合约解读](https://steemit.com/forsage/@chaimyu/forsage)

#### 前端库
[ethers.js v5 中文文档](https://learnblockchain.cn/ethers_v5/)

[ethers.js v6 英版文档](https://docs.ethers.org/v6/)

[WTF - Ethers.js 入门](https://www.wtf.academy/docs/ethers-101/)

[WTF - Ethers.js 进阶](https://www.wtf.academy/docs/ethers-102/)



#### 钱包
[区块链钱包系列课程](https://thewebthree.xyz/1/course_article)

[区块链钱包系列课程 - github](https://github.com/the-web3/blockchain-wallet/blob/master/chapter/readme.md)：内容跟上面有点不同，图片讲解更多更高清

[如何开发钱包 - 技术文章整理](https://learnblockchain.cn/2019/04/11/wallet-dev-guide/)

[钱包开源仓库](https://github.com/lixuCode)：暂时未看，还不确定是不是软广，暂留

#### Defi

[《How to DeFi Beginner v2(中文版)》](https://nigdaemon.gitbook.io/how-to-defi-beginnerv2)

[《How to DeFi: Advanced（中文版）》](https://nigdaemon.gitbook.io/how-to-defi-advanced-zhogn-wen-b)

[《How to Defi 中文版 PDF》](https://assets.coingecko.com/books/how-to-defi/How_to_DeFi_Chinese.pdf)

##### uniswap
[Uniswap V3 Book 中文版](https://y1cunhui.github.io/uniswapV3-book-zh-cn/)

[[科普]由浅入深理解uniswapV3原理 | Dapp Learning 视频教程](https://www.youtube.com/watch?v=3Wr8Ry1ragg&list=PLgPVMJY4tnFPfwAbNx3UFmHne66pkl_OH)

## Solana 架构

### 语言学习

[学习 Rust](https://www.rust-lang.org/zh-CN/learn)

[The Rust Programming Language](https://doc.rust-lang.org/book/)

[《Rust 程序设计语言》](https://kaisery.github.io/trpl-zh-cn/)

### 官方文档
[Solana Developers](https://solana.com/docs/intro/quick-start)

## web3 产品
### 钱包
[小狐狸钱包](https://metamask.io/): 以太老牌钱包，只支持 EVM 生态网络，例如 BSC 和二层网络 Arbitrum 等，集成了 ERC 代币交互和 EVM 生态链跨链换币功能，收费较高 0.875%，不太推荐

[OKX钱包](https://www.okx.com/zh-hans/web3):  一个助记词生成多链钱包，例如 BTC、Ethereum、Solana 等，集成了很多 Dex 聚合器，方便兑换同链代币或跨链代币，只能实时选取最优的 Dex

#### 安全插件
[pocketuniverse](https://www.pocketuniverse.app/): 谷歌精选插件，用户 10w+，钓鱼网站检查，模拟交易，风险提醒

[walletguard](https://www.walletguard.app/): 钓鱼网站检查，模拟交易提前显示结果，提醒用户避免过度授权

[revoke](https://revoke.cash): 查看钱包所有授权记录，支持快速撤销授权

### 跨链桥 DEx

[Arbitrum](https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum): 以太二层网络，可以吧 ETH 或 ERC20 代币跨链到 Arbitrum，然后在利用 Uniswap、Curve 等兑换代币，可以节省大量交易 gas 费。
PS. 交易等待较长，超 15 分钟，在乎实效可以用第三方跨链桥 Hop、Synapse、Orbiter 等

[Uniswap](https://app.uniswap.org/swap): EVM 生态交易所，任意 ERC20 代币交换，手续费 0.25%，比小狐狸便宜

[Curve](https://curve.fi/#/ethereum/swap): EVM 生态稳定币交易所，只兑换稳定币，例如 USDT，使用 curve  更便宜

[simpleswap](https://simpleswap.io/cn)
：发起一笔币币交易，可用任意钱包转账 A 币到池子地址，它会自动把你想要的 B 币种（可以跨链。有的时候币 OKX 的跨链桥便宜）转到你提供的钱包地址里。（执行过几次小笔交易，几分钟内到账）

### 混币器

[Tornado Cash](https://tornado.ws/)：避免转账被追踪，Dexx 交易所被盗，[黑客洗 ETH](https://x.com/evilcos/status/1866642201985552464?s=12&t=4Q0oifuc6DNwywQuU8bYuQ)就是用的这个协议

### 其他
[bot 聚合器](https://doc.nftsniper.club/getting-started/module): swap、K线、项目跟单，NTF、空投、地址管理、推特监听等功能，需付费解锁，学习大佬开发的工具

[1inch](https://app.1inch.io/#/1/simple/swap/1:ETH): DEX 集合器，提供最佳交易路径，专业省心，不用自己去比对各个交易所的价格