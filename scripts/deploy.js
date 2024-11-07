// scripts/deploy.js

const hre = require("hardhat");
const ethers = require("ethers");
const { ethers } = require("hardhat");
const Safe = require("@safe-global/protocol-kit").default;
const { SafeFactory, EthersAdapter } = require("@safe-global/protocol-kit");
const { SafeAccountConfig } = require("@safe-global/protocol-kit");
const { SafeTransactionOptionalProps } = require("@safe-global/protocol-kit");

async function main() {
  const [deployer, delegate] = await hre.ethers.getSigners();
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

  const safeAddress = ethers.getAddress(
    "0xcd28417f1d4930f879f9aee7ebf2e9cc19d2c867"
  );

  const moduleAddress = ethers.getAddress(
    "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690"

  // Get the contract factories
  const CoboFactory = await hre.ethers.getContractFactory("CoboFactory");
  const CoboSafeAccount = await hre.ethers.getContractFactory(
    "CoboSafeAccount"
  );
  const CoboSmartAccount = await hre.ethers.getContractFactory(
    "CoboSmartAccount"
  );
  const ArgusRootAuthorizer = await hre.ethers.getContractFactory(
    "ArgusRootAuthorizer"
  );
  const FuncAuthorizer = await hre.ethers.getContractFactory("FuncAuthorizer");
  const TransferAuthorizer = await hre.ethers.getContractFactory(
    "TransferAuthorizer"
  );

  // Deploy CoboFactory
  console.log("Deploying CoboFactory...");
  const [deployer, delegate] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const coboFactory = await CoboFactory.deploy(deployer.address);
  const coboFactoryAddress = await coboFactory.getAddress();
  console.log("CoboFactory deployed to:", coboFactoryAddress);

  // Deploy CoboSafeAccount
  console.log("Deploying CoboSafeAccount...");
  const coboSafeAccount = await CoboSafeAccount.deploy(deployer);
  const coboSafeAccountAddress = await coboSafeAccount.getAddress();
  console.log("CoboSafeAccount deployed to:", coboSafeAccountAddress);

  // Deploy CoboSmartAccount
  console.log("Deploying CoboSmartAccount...");
  const coboSmartAccount = await CoboSmartAccount.deploy(deployer);
  const coboSmartAccountAddress = await coboSmartAccount.getAddress();
  console.log("CoboSmartAccount deployed to:", coboSmartAccountAddress);

  // Deploy ArgusRootAuthorizer
  console.log("Deploying ArgusRootAuthorizer...");
  const argusRootAuthorizer = await ArgusRootAuthorizer.deploy(
    deployer.address, // _owner
    deployer.address, // _caller
    coboSmartAccountAddress // _account (assuming you use CoboSmartAccount)
  );
  const argusRootAuthorizerAddress = await argusRootAuthorizer.getAddress();
  console.log("ArgusRootAuthorizer deployed to:", argusRootAuthorizerAddress);

  // Deploy FuncAuthorizer
  console.log("Deploying FuncAuthorizer...");
  const funcAuthorizer = await FuncAuthorizer.deploy(
    deployer.address,
    deployer.address
  );
  const funcAuthorizerAddress = await funcAuthorizer.getAddress();
  console.log("FuncAuthorizer deployed to:", funcAuthorizerAddress);

  // Deploy TransferAuthorizer
  console.log("Deploying TransferAuthorizer...");
  const transferAuthorizer = await TransferAuthorizer.deploy(
    deployer.address,
    deployer.address
  );
  const transferAuthorizerAddress = await transferAuthorizer.getAddress();
  console.log("TransferAuthorizer deployed to:", transferAuthorizerAddress);

  //   // Add other deployments as needed

  // If needed, initialize contracts or set up relationships
  // For example, adding implementations to CoboFactory
  console.log("Adding implementations to CoboFactory...");
  const tx1 = await coboFactory.addImplementation(coboSafeAccountAddress);
  await tx1.wait();
  const tx2 = await coboFactory.addImplementation(coboSmartAccountAddress);
  await tx2.wait();
  console.log("Implementations added to CoboFactory.");
  //   console.log(tx1.hash);
  //   console.log(tx2.hash);

  // Set the authorizer in the CoboSmartAccount
  console.log(
    "Setting ArgusRootAuthorizer as the authorizer in CoboSmartAccount..."
  );
  let tx = await coboSmartAccount.setAuthorizer(argusRootAuthorizerAddress);
  await tx.wait();
  console.log("Authorizer set in CoboSmartAccount.");

  // Add FuncAuthorizer and TransferAuthorizer to ArgusRootAuthorizer
  const ADMIN = "ADMIN";
  const role = ethers.encodeBytes32String(ADMIN); // Define the role
  console.log("Adding FuncAuthorizer to ArgusRootAuthorizer...");
  tx = await argusRootAuthorizer.addAuthorizer(
    false,
    role,
    funcAuthorizerAddress
  );
  await tx.wait();
  console.log("FuncAuthorizer added.");

  console.log("Adding TransferAuthorizer to ArgusRootAuthorizer...");
  tx = await argusRootAuthorizer.addAuthorizer(
    false,
    role,
    transferAuthorizerAddress
  );
  await tx.wait();
  console.log("TransferAuthorizer added.");

  // Replace with the delegate's address
  const roleManagerAddress = await coboSmartAccount.roleManager();
  const RoleManager = await hre.ethers.getContractFactory("FlatRoleManager");
  const roleManager = RoleManager.attach(roleManagerAddress);

  //   console.log("Granting role to delegate...");
  //   console.log("roleManager:", roleManager);
  //   tx = await roleManager.grantRole(delegate.address, role);
  //   await tx.wait();
  //   console.log("Role granted to delegate.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });
