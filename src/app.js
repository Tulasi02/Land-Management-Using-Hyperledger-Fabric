const { Gateway, Wallets } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'connection.json');

async function main() {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userExists = await wallet.get('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');

    const contract = network.getContract('land');

    // Invoke a transaction on the network
    await contract.submitTransaction('createLand', 'land1', '100', '200', '300', '400', 'owner1');

    // Query the ledger
    const result = await contract.evaluateTransaction('queryAllLands');
    console.log(`Transaction query result: ${result.toString()}`);

    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}

main();
