const hre = require("hardhat");
const ethers = hre.ethers;
const { SafeFactory } = require("@safe-global/protocol-kit");
const { createPublicClient, http } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { hardhat } = require("viem/chains");

async function main() {
  // Replace with your deployer's private key
  // const privateKey =
  //   "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const [deployer] = await ethers.getSigners();
  const account = deployer.address;

  const client = createPublicClient({
    chain: 31337,
    transport: http("http://127.0.0.1:8545"),
  });

  // Contract addresses (ensure these are correct and deployed)
  const safeSingletonAddress = ethers.getAddress(
    "0xae99CA7255Ea17ea4af2428C612Cf10CACFafaeE"
  );
  const safeProxyFactoryAddress = ethers.getAddress(
    "0x59ddD083Cf820f568eB3a40eD833AC715Db6D6B5"
  );
  const multiSendAddress = ethers.getAddress(
    "0x228a04A59BEF23106Bcb2b4158422baAC60646Ce"
  );
  const multiSendCallOnlyAddress = ethers.getAddress(
    "0x50cafDD5E439994509202CfCd569DcA7E1fd9659"
  );
  const fallbackHandlerAddress = ethers.getAddress(
    "0xDC1336f9E6488cD03b533449ea723cE32f2B1Ff3"
  );
  const signMessageLibAddress = ethers.getAddress(
    "0x8fcB4617eae6261Cea37e629244AA2A4d92940d1"
  );
  const createCallAddress = ethers.getAddress(
    "0xB22D635D552eC95142E2Abe3FfB859eA7d7C0316"
  );
  const simulateTxAccessorAddress = ethers.getAddress(
    "0x38710E559A67ef07bcF8EeA70B076ac8e756DE08"
  );
  // Omit or set to zero address if not used
  // const safeWebAuthnSignerFactoryAddress = ethers.ZeroAddress;

  // Create the contract networks configuration
  const chainId = (await client.getChainId()).toString();

  const contractNetworks = {
    [chainId]: {
      safeSingletonAddress,
      safeProxyFactoryAddress,
      multiSendAddress,
      multiSendCallOnlyAddress,
      fallbackHandlerAddress,
      signMessageLibAddress,
      createCallAddress,
      simulateTxAccessorAddress,
    },
  };
  // Define the Safe configuration
  const safeAccountConfig = {
    owners: [account],
    threshold: 1,
  };

  // Initialize the SDK with the predicted Safe
  const predictedSafe = {
    safeAccountConfig,
    safeDeploymentConfig: {
      saltNonce: "0", // Adjust as needed
    },
  };

  const safeFactory = await SafeFactory.create({
    deployer,
    contractNetworks,
  });

  const protocolKit = await safeFactory.deploySafe({ safeAccountConfig });

  // const safeSdk = await Safe.init({
  //   provider: client,
  //   signer: account,
  //   predictedSafe,
  //   contractNetworks,
  // });

  // // Deploy the Safe
  // console.log("Deploying new Safe...");
  // const safeFactory = await sa.create({
  //   ethAdapter,
  //   contractNetworks,
  // });

  // const safeAddress = await safeSdk.getAddress();
  // console.log("Predicted Safe address:", safeAddress);

  // const deploySafeTx = await safeSdk.createSafeDeploymentTransaction();
  // console.log(deploySafeTx);
  // const txHash = await deployer.sendTransaction({
  //   to: deploySafeTx.to,
  //   value: BigInt(deploySafeTx.value),
  //   data: `0x${deploySafeTx.data}`,
  // });
  // console.log("Transaction hash:", txHash);

  // const txReceipt = await waitForTransactionReceipt(deployer, { hash: txHash });

  // // Extract the Safe address from the deployment transaction receipt
  // const safeAddress = getSafeAddressFromDeploymentTx(txReceipt);
  // console.log("Safe deployed at:", safeAddress);

  // const deploySafeTxResponse = await safeSdk.executeTransaction(deploySafeTx);
  // await deploySafeTxResponse.transactionResponse.wait();
  // console.log("Safe deployed at:", safeAddress);

  // // Deploy CoboSafeAccount
  // console.log("Deploying CoboSafeAccount...");
  // const CoboSafeAccount = await ethers.getContractFactory("CoboSafeAccount");
  // const coboSafeAccount = await CoboSafeAccount.deploy(safeAddress);
  // await coboSafeAccount.deployed();
  // const coboSafeAccountAddress = coboSafeAccount.address;
  // console.log("CoboSafeAccount deployed at:", coboSafeAccountAddress);

  // // Enable the CoboSafeAccount module
  // const moduleAddress = coboSafeAccountAddress;
  // const enableModuleTx = await safeSdk.createEnableModuleTx(moduleAddress);

  // // Sign the transaction
  // const signedEnableModuleTx = await safeSdk.signTransaction(enableModuleTx);

  // // Execute the transaction
  // const enableModuleTxResponse = await safeSdk.executeTransaction(
  //   signedEnableModuleTx
  // );
  // await enableModuleTxResponse.transactionResponse.wait();
  // console.log("CoboSafeAccount module enabled.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
