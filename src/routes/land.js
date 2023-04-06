const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');

const router = express.Router();

const ccpPath = path.resolve(__dirname, '..', '..', 'connection.json');

router.get('/lands', async (req, res) => {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userExists = await wallet.get('user1');
    if (!userExists) {
      res.status(401).json({ error: 'User identity not found in wallet' });
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('land');

    const result = await contract.evaluateTransaction('queryAllLands');
    res.json(JSON.parse(result.toString()));

    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to query lands: ${error}`);
    res.status(500).json({ error: 'Failed to query lands' });
  }
});

router.post('/lands', async (req, res) => {
  try {
    const { landID, area, latitude, longitude, value, owner } = req.body;

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userExists = await wallet.get('user1');
    if (!userExists) {
      res.status(401).json({ error: 'User identity not found in wallet' });
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('land');

    await contract.submitTransaction('createLand', landID, area, latitude, longitude, value, owner);
    res.json({ message: 'Land created successfully' });

    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to create land: ${error}`);
    res.status(500).json({ error: 'Failed to create land' });
  }
});

module.exports = router;
