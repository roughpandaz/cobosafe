// scripts/deploy.js

const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const [deployer] = await ethers.getSigners();
  const CoboSmartAccount = await hre.ethers.getContractFactory(
    "CoboSmartAccount"
  );
  const ArgusRootAuthorizer = await hre.ethers.getContractFactory(
    "ArgusRootAuthorizer"
  );

  // /////////////////

  // Deploy CoboToken
  console.log("Deploying CoboToken...");
  const initialSupply = ethers.parseUnits("1000000", 18); // 1,000,000 tokens
  const CoboToken = await ethers.getContractFactory("CoboToken");
  const coboToken = await CoboToken.deploy(initialSupply);
  await coboToken.waitForDeployment();
  const coboTokenAddress = await coboToken.getAddress();
  console.log("CoboToken deployed to:", coboTokenAddress);

  // Deploy other contracts (CoboFactory, CoboSmartAccount, etc.)
  // ... (ensure coboSmartAccount is available)

  // Transfer tokens to coboSmartAccount
  // Deploy CoboSmartAccount
  console.log("Deploying CoboSmartAccount...");
  const coboSmartAccount = await CoboSmartAccount.deploy(deployer);
  const coboSmartAccountAddress = await coboSmartAccount.getAddress();
  console.log("CoboSmartAccount deployed to:", coboSmartAccountAddress);
  console.log("Transferring tokens to the smart account...");
  let tx = await coboToken
    .connect(deployer)
    .transfer(coboSmartAccountAddress, ethers.parseUnits("50000", 18));
  await tx.wait();
  console.log("Tokens transferred to smart account.");

  // Deploy TransferACLs using coboTokenAddress
  console.log("Deploying TransferACL1...");
  const TransferACL1 = await ethers.getContractFactory("TransferACL1");
  const transferACL1 = await TransferACL1.deploy(
    deployer.address,
    deployer.address,
    coboTokenAddress
  );
  await transferACL1.waitForDeployment();
  const transferACL1Address = await transferACL1.getAddress();
  console.log("TransferACL1 deployed to:", transferACL1Address);

  console.log("Deploying TransferACL2...");
  const TransferACL2 = await ethers.getContractFactory("TransferACL2");
  const transferACL2 = await TransferACL2.deploy(
    deployer.address,
    deployer.address,
    coboTokenAddress
  );
  await transferACL2.waitForDeployment();
  const transferACL2Address = await transferACL2.getAddress();
  console.log("TransferACL2 deployed to:", transferACL2Address);

  console.log("Deploying TransferACL3...");
  const TransferACL3 = await ethers.getContractFactory("TransferACL3");
  const transferACL3 = await TransferACL3.deploy(
    deployer.address,
    deployer.address,
    coboTokenAddress
  );
  await transferACL3.waitForDeployment();
  const transferACL3Address = await transferACL3.getAddress();
  console.log("TransferACL3 deployed to:", transferACL3Address);

  // Define roles using ethers.js v6 syntax
  const roleAdmin = ethers.encodeBytes32String("ADMIN");
  const roleUser = ethers.encodeBytes32String("USER");

  // Add authorizers to ArgusRootAuthorizer
  // Deploy ArgusRootAuthorizer
  console.log("Deploying ArgusRootAuthorizer...");
  const argusRootAuthorizer = await ArgusRootAuthorizer.deploy(
    deployer.address, // _owner
    deployer.address, // _caller
    coboSmartAccountAddress // _account (assuming you use CoboSmartAccount)
  );
  const argusRootAuthorizerAddress = await argusRootAuthorizer.getAddress();
  console.log("ArgusRootAuthorizer deployed to:", argusRootAuthorizerAddress);

  console.log("Adding TransferACLs to ArgusRootAuthorizer...");
  tx = await argusRootAuthorizer.addAuthorizer(
    false,
    roleUser,
    transferACL1Address
  );
  await tx.wait();
  tx = await argusRootAuthorizer.addAuthorizer(
    false,
    roleUser,
    transferACL2Address
  );
  await tx.wait();
  tx = await argusRootAuthorizer.addAuthorizer(
    false,
    roleUser,
    transferACL3Address
  );
  await tx.wait();
  console.log("TransferACLs added.");

  // Assign roles to delegates
  const delegateAdmin = "0xDelegateAdminAddress"; // Replace with actual address
  const delegateUser = "0xDelegateUserAddress"; // Replace with actual address

  // Deploy FlatRoleManager and set it in coboSmartAccount if not already done
  const roleManagerAddress = await coboSmartAccount.roleManager();
  const RoleManager = await hre.ethers.getContractFactory("FlatRoleManager");
  const flatRoleManager = RoleManager.attach(roleManagerAddress);

  console.log("Granting ADMIN role to delegateAdmin...");
  tx = await flatRoleManager.grantRole(delegateAdmin, roleAdmin);
  await tx.wait();
  console.log("ADMIN role granted.");

  console.log("Granting USER role to delegateUser...");
  tx = await flatRoleManager.grantRole(delegateUser, roleUser);
  await tx.wait();
  console.log("USER role granted.");

  console.log("Deployment and setup complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });
