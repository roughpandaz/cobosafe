// scripts/deploy.js

const hre = require("hardhat");
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
  );

  // Initialize the Ethers Adapter
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: deployer,
  });

  // Initialize the Safe SDK
  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress,
  });

  // Get contract factories
  const Safe = await ethers.getContractFactory("Safe");
  const SafeProxyFactory = await ethers.getContractFactory("SafeProxyFactory");

  // Attach to deployed contracts
  const safeProxyFactory = SafeProxyFactory.attach(
    safeProxyFactoryAddress
  ).connect(deployer);

  const safeTransaction = await safeSdk.createEnableModuleTx(moduleAddress);
  const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction);

  const txResponse = await safeSdk.executeTransaction(signedSafeTransaction);
  await txResponse.transactionResponse.wait();

  console.log("CoboSafeAccount module enabled.");

  // // Get the contract factories

  // // Prepare the enableModule transaction data
  // // const enableModuleAbi = ["function enableModule(address module)"];
  // // console.log(Safe.interface.getFunction("enableModule"));
  // // console.log(enableModuleAbi);
  // // const enableModuleInterface = new ethers.Interface(enableModuleAbi);
  // const enableModuleInterface = Safe.interface.getFunction("enableModule");
  // console.log(enableModuleInterface);
  // const enableModuleData = Safe.interface.encodeFunctionData("enableModule", [
  //   "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690",
  // ]);

  // // Parameters for execTransaction
  // const to = safeProxyFactoryAddress; // The Safe contract address
  // const value = 0;
  // const data = enableModuleData;
  // const operation = 0; // Enum.Operation.Call
  // const safeTxGas = 100000000000000000000; // Estimate or set a reasonable gas limit
  // const baseGas = 0;
  // const gasPrice = 0;
  // const gasToken = ethers.ZeroAddress;
  // const refundReceiver = ethers.ZeroAddress;
  // const nonce = await safeProxyFactory.n;

  // console.log(
  //   "TESTING",
  //   to,
  //   value,
  //   data,
  //   operation,
  //   safeTxGas,
  //   baseGas,
  //   gasPrice,
  //   gasToken,
  //   refundReceiver,
  //   nonce
  // );

  // // Get the transaction hash to sign
  // const txHash = await SafeProxyFactory.getTransactionHash(
  //   to,
  //   value,
  //   data,
  //   operation,
  //   safeTxGas,
  //   baseGas,
  //   gasPrice,
  //   gasToken,
  //   refundReceiver,
  //   nonce
  // );

  // // Sign the transaction hash
  // const txHashBytes = ethers.getBytes(txHash);
  // const signature = await deployer.signMessage(txHashBytes);

  // // Since Gnosis Safe expects the signature in a specific format, we need to adjust it
  // // The signature should include the signer’s address and the signature type (EIP-1271)
  // const ethSignedMessagePrefix = "\x19Ethereum Signed Message:\n32";
  // const prefixedHash = ethers.keccak256(
  //   ethers.concat([ethers.toUtf8Bytes(ethSignedMessagePrefix), txHashBytes])
  // );
  // const signatureBytes = ethers.concat([
  //   signature,
  //   ethers.getBytes("0x01"), // Signature type (EOA)
  // ]);

  // // Execute the transaction
  // const txResponse = await SafeProxyFactory.execTransaction(
  //   to,
  //   value,
  //   data,
  //   operation,
  //   safeTxGas,
  //   baseGas,
  //   gasPrice,
  //   gasToken,
  //   refundReceiver,
  //   signatureBytes
  // );

  // await txResponse.wait();

  console.log("CoboSafeAccount module enabled.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });
