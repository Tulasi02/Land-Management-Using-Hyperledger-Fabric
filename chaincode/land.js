'use strict';

const { Contract } = require('fabric-contract-api');

class Land extends Contract {

    async createLand(ctx, id, owner, area, value) {
        console.info('============= START : Create Land ===========');

        const land = {
            id,
            docType: 'land',
            owner,
            area,
            value,
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(land)));
        console.info('Added <--> ', land);
        console.info('============= END : Create Land ===========');
    }

    async queryLand(ctx, id) {
        const landAsBytes = await ctx.stub.getState(id); // get the land from chaincode state
        if (!landAsBytes || landAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        console.log(landAsBytes.toString());
        return landAsBytes.toString();
    }

    async queryAllLands(ctx) {
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
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeLandOwner(ctx, id, newOwner) {
        console.info('============= START : changeLandOwner ===========');

        const landAsBytes = await ctx.stub.getState(id);
        if (!landAsBytes || landAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const land = JSON.parse(landAsBytes.toString());
        land.owner = newOwner;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(land)));
        console.info('============= END : changeLandOwner ===========');
    }
}

module.exports = Land;
