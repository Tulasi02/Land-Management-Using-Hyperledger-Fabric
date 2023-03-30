'use strict';

const { Contract } = require('fabric-contract-api');

class Ownership extends Contract {

    async createOwner(ctx, id, name, email) {
        console.info('============= START : Create Owner ===========');

        const owner = {
            id,
            docType: 'owner',
            name,
            email,
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(owner)));
        console.info('Added <--> ', owner);
        console.info('============= END : Create Owner ===========');
    }

    async queryOwner(ctx, id) {
        const ownerAsBytes = await ctx.stub.getState(id); // get the owner from chaincode state
        if (!ownerAsBytes || ownerAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        console.log(ownerAsBytes.toString());
        return ownerAsBytes.toString();
    }

    async queryAllOwners(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.docType === 'owner') {
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async transferLandOwnership(ctx, landId, newOwnerId) {
        console.info('============= START : transferLandOwnership ===========');

        const landAsBytes = await ctx.stub.getState(landId);
        if (!landAsBytes || landAsBytes.length === 0) {
            throw new Error(`${landId} does not exist`);
        }
        const land = JSON.parse(landAsBytes.toString());
        land.owner = newOwnerId;

        await ctx.stub.putState(landId, Buffer.from(JSON.stringify(land)));
        console.info('============= END : transferLandOwnership ===========');
    }
}

module.exports = Ownership;
