// scripts/deploy.js

const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const [deployer, user] = await ethers.getSigners();
  // No need to generate any newer typings.
  // sending eth to create2 contract deployer address (0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37) (tx: 0x0f59729000f9f4f26f612a99c67e15d68b94e7474fe234373255481d8c201f3f)...
  // deploying create2 deployer contract (at 0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7) using deterministic deployment (https://github.com/Arachnid/deterministic-deployment-proxy) (tx: 0x41a6b731f53cf45627c3976abcb9ecd52fb2142f8f6fbbff4e0bb54a9b3667bc)...
  // deploying "SimulateTxAccessor" (tx: 0xd61c54181f402ab70336d38f2ec307039d258181078ac94ad094b62b03bc2732)...: deployed at 0x38710E559A67ef07bcF8EeA70B076ac8e756DE08 with 237931 gas
  // deploying "SafeProxyFactory" (tx: 0xa9aa6e0ce7c57d81bb4e6600af3937597a13e4d1a776ec90a5454052140b240b)...: deployed at 0x59ddD083Cf820f568eB3a40eD833AC715Db6D6B5 with 986413 gas
  // deploying "TokenCallbackHandler" (tx: 0xbd9216a082c112301d6071a892787ee7c592b391b86d1211b8104c02e753a266)...: deployed at 0x45a03a27D4BA1B0CC9784E3961C5f6C16aCBd381 with 453406 gas
  // deploying "CompatibilityFallbackHandler" (tx: 0x28958da2c41bbb8fe852aa6a026152457e57ee6eef3000fafeeae294102d3e6d)...: deployed at 0xDC1336f9E6488cD03b533449ea723cE32f2B1Ff3 with 1059977 gas
  // deploying "CreateCall" (tx: 0x0e1a36d3154eddbd53993d89b877b36a217b51ca85a1e60e6fbc97af09c147ca)...: deployed at 0xB22D635D552eC95142E2Abe3FfB859eA7d7C0316 with 290470 gas
  // deploying "MultiSend" (tx: 0x1f355ba4acff3aa11640bee5dcddaca16a84afc43cb2fa3f8b979aa63e21f5ad)...: deployed at 0x228a04A59BEF23106Bcb2b4158422baAC60646Ce with 192878 gas
  // deploying "MultiSendCallOnly" (tx: 0x4ec4925db962e668bc777fe94c93afeeb3905c6f692b1835bad95f0697cd6e06)...: deployed at 0x50cafDD5E439994509202CfCd569DcA7E1fd9659 with 144954 gas
  // deploying "SignMessageLib" (tx: 0xb28c5cd2fad66a8cda21b7f9d601d2e2f39e79327224f79e326e9ecf3cbe5453)...: deployed at 0x8fcB4617eae6261Cea37e629244AA2A4d92940d1 with 262417 gas
  // deploying "SafeToL2Setup" (tx: 0xce6bf63d226ff6df57ced477612fe04780270dece1aa32f709eb892416e102f4)...: deployed at 0x5941bAEf7a31933bF00B7f5Cc0Ae6abc6E41e3f0 with 230863 gas
  // deploying "Safe" (tx: 0x2af4e38beb75426f6b5a96e0e2484220f59cbe50645c567614e8334671b45f44)...: deployed at 0xae99CA7255Ea17ea4af2428C612Cf10CACFafaeE with 4713111 gas
  // deploying "SafeL2" (tx: 0x1eab892b4ba4275763fcd14ef72ec9d8ca3e1ed5c812c591a6af34e092e83485)...: deployed at 0x65f6F868cc9F611A90dE7246bf9e63a9A6c152e5 with 4882139 gas
  // deploying "SafeToL2Migration" (tx: 0x595a4998da2710081e7c3ba1dd55685892de8a6890281538def37f1ab88f13d8)...: deployed at 0x1844763966A9D5380801Dbd3554dc0aBa8B875C7 with 1283078 gas
  // deploying "SafeMigration" (tx: 0x9758d2e84a9fb542fa5a31e3cd34400b3ea031f7f1342ab2003471c979d7fe72)...: deployed at 0xFCe88fee60C0f45feEb002Ff4FF640E1825528D8 with 512882 gas

  // Retrieve deployed contract addresses
  const safeMasterCopyAddress = ethers.getAddress(
    "0xae99CA7255Ea17ea4af2428C612Cf10CACFafaeE"
  );
  const safeProxyFactoryAddress = ethers.getAddress(
    "0x59ddD083Cf820f568eB3a40eD833AC715Db6D6B5"
  );
  const fallbackHandlerAddress = ethers.getAddress(
    "0xdc1336f9e6488cd03b533449ea723ce32f2b1ff3"
  );

  // Get contract factories
  const Safe = await ethers.getContractFactory("Safe");
  const SafeProxyFactory = await ethers.getContractFactory("SafeProxyFactory");

  // Attach to deployed contracts
  const safeProxyFactory = SafeProxyFactory.attach(
    safeProxyFactoryAddress
  ).connect(deployer);

  console.log(
    "safeProxyFactory.createProxyWithNonce:",
    safeProxyFactory.createProxyWithNonce
  );

  // Prepare the setup data
  const owners = [deployer.address, user.address];
  const threshold = 1;

  const param = [
    owners, // address[] _owners
    threshold, // uint256 _threshold
    ethers.ZeroAddress, // address to
    "0x", // bytes data
    fallbackHandlerAddress, // address fallbackHandler
    ethers.ZeroAddress, // address paymentToken
    0, // uint256 payment
    ethers.ZeroAddress, // address payable paymentReceiver
  ];
  // console.log(param);
  // Encode the setup call
  const setupData = Safe.interface.encodeFunctionData("setup", param);
  console.log(setupData);

  // Create the Safe Proxy
  console.log("Creating Safe Proxy with proxy factory...");
  const saltNonce = 4;

  const proxyCreationTx = await safeProxyFactory.createProxyWithNonce(
    "0xae99CA7255Ea17ea4af2428C612Cf10CACFafaeE",
    "0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000dc1336f9e6488cd03b533449ea723ce32f2b1ff30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000000000000000000",
    7
  );

  const proxyTX = await proxyCreationTx.wait();
  console.log(proxyTX);

  // Extract the proxy address from the event logs
  const proxyCreationEvent = proxyTX.events.find(
    (event) => event.event === "ProxyCreation"
  );

  if (!proxyCreationEvent) {
    console.error("ProxyCreation event not found");
    return;
  }

  const proxyAddress = proxyCreationEvent.args.proxy;
  console.log("Safe Proxy deployed at:", proxyAddress);

  // // Connect to the Safe proxy contract
  // 0xdd385872004a03fe741af2c2d870b4b9a3d49c69,0xae99ca7255ea17ea4af2428c612cf10cacfafaee
  const safeProxy = Safe.attach("0xdd385872004a03fe741af2c2d870b4b9a3d49c69");

  // ... rest of your code ...
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });
