# ZJU_Block_Chain_finalwork
 浙江大学区块链大作业_DAPP



### 部署方法

1. 用Ganache创建私有网络
2. 编译与部署合约
   1. 在Remix中打开/contracts/NFT_market.sol，
      2. 进入SOLIDITY COMPILER页面，选择 ，编译合约
   2. 进入DEPLOY & RUN TRANSACTIONS页面，选择ENVIRONMENT为Injected Web3，CONTRACT选择NFT_Market，部署
   3. 将/src/solc_files/NFT_market.js中的address改为部署后的地址
3. 运行项目前端
   1. yarn install
   2. yarn start

