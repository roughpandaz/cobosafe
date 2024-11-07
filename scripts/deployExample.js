// scripts/deploy.js

const hre = require("hardhat");
const { ethers } = require("hardhat");
const Safe = require("@safe-global/protocol-kit");
const { SafeFactory, EthersAdapter } = require("@safe-global/protocol-kit");
const { SafeAccountConfig } = require("@safe-global/protocol-kit");
const { SafeTransactionOptionalProps } = require("@safe-global/protocol-kit");

async function main() {
  const [deployer, user] = await ethers.getSigners();

  // console.log(Safe);
  // // Retrieve deployed contract addresses
  const safeMasterCopyAddress = ethers.getAddress(
    "0xae99CA7255Ea17ea4af2428C612Cf10CACFafaeE"
  );
  const safeProxyFactoryAddress = ethers.getAddress(
    "0x59ddD083Cf820f568eB3a40eD833AC715Db6D6B5"
  );
  const fallbackHandlerAddress = ethers.getAddress(
    "0xdc1336f9e6488cd03b533449ea723ce32f2b1ff3"
  );

  // const moduleAddress = ethers.getAddress(
  //   "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690"
  // );

  // const protocolKit = await Safe.init({
  //   provider: hre.ethers.provider,
  //   signer: deployer.address,
  //   safeAddress: safeMasterCopyAddress,
  // });

  // const newProtocolKit = await protocolKit.connect({
  //   signer: deployer.address,
  //   safeAddress: safeMasterCopyAddress,
  // });

  // const transaction = await protocolKit.createSafeDeploymentTransaction();
  // console.log(transaction);

  // const safeFactory = await SafeFactory.create({ ethAdapter });

  // const safeAccountConfig = {
  //   owners: [deployer.address], // List of Safe owners
  //   threshold: 1, // Number of required confirmations
  // };

  // console.log("Deploying new Safe...");
  // const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
  // const safeAddress = safeSdk.getAddress();
  // console.log("Safe deployed at:", safeAddress);

  ////////////////////////////// CREATE SAFE ENCODING ////////////////////////////////////
  // Get contract factories
  const Safe = await ethers.getContractFactory("Safe");
  const SafeProxyFactory = await ethers.getContractFactory("SafeProxyFactory");

  // Attach to deployed contracts
  const safeProxyFactory = SafeProxyFactory.attach(
    safeProxyFactoryAddress
  ).connect(deployer);

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
  console.log("setupData", setupData);

  ////////////////////////////// CREATE SAFE ENCODING ////////////////////////////////////

  // Create the Safe Proxy
  // console.log("Creating Safe Proxy with proxy factory...");
  // const saltNonce = 4;

  // const proxyCreationTx = await safeProxyFactory.createProxyWithNonce(
  //   "0xae99CA7255Ea17ea4af2428C612Cf10CACFafaeE",
  //   "0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000dc1336f9e6488cd03b533449ea723ce32f2b1ff30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000000000000000000",
  //   7
  // );

  // const proxyTX = await proxyCreationTx.wait();
  // console.log(proxyTX);

  // // Extract the proxy address from the event logs
  // const proxyCreationEvent = proxyTX.events.find(
  //   (event) => event.event === "ProxyCreation"
  // );

  // if (!proxyCreationEvent) {
  //   console.error("ProxyCreation event not found");
  //   return;
  // }

  // const proxyAddress = proxyCreationEvent.args.proxy;
  // console.log("Safe Proxy deployed at:", proxyAddress);

  // // Connect to the Safe proxy contract
  // 0xdd385872004a03fe741af2c2d870b4b9a3d49c69,0xae99ca7255ea17ea4af2428c612cf10cacfafaee
  // const safeProxy = Safe.attach("0xdd385872004a03fe741af2c2d870b4b9a3d49c69");

  // ... rest of your code ...
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });
