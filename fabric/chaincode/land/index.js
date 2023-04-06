'use strict';

const { Contract } = require('fabric-contract-api');
const shim = require('fabric-shim');
const util = require('util');

class LandContract extends Contract {

  async initLedger(ctx) {
    console.info('============= START : Initialize Ledger ===========');
    // Add initial data to the ledger here if needed
    console.info('============= END : Initialize Ledger ===========');
  }

  async createLand(ctx, landId, owner, size, location) {
    console.info('============= START : Create Land ===========');
    const land = {
      id: landId,
      owner,
      size,
      location
    };
    await ctx.stub.putState(landId, Buffer.from(JSON.stringify(land)));
    console.info('============= END : Create Land ===========');
  }

  async readLand(ctx, landId) {
    console.info('============= START : Read Land ===========');
    const landAsBytes = await ctx.stub.getState(landId);
    if (!landAsBytes || landAsBytes.length === 0) {
      throw new Error(`${landId} does not exist`);
    }
    const land = JSON.parse(landAsBytes.toString());
    console.info('============= END : Read Land ===========');
    return land;
  }

  async updateLand(ctx, landId, owner, size, location) {
    console.info('============= START : Update Land ===========');
    const landAsBytes = await ctx.stub.getState(landId);
    if (!landAsBytes || landAsBytes.length === 0) {
      throw new Error(`${landId} does not exist`);
    }
    const land = JSON.parse(landAsBytes.toString());
    land.owner = owner;
    land.size = size;
    land.location = location;
    await ctx.stub.putState(landId, Buffer.from(JSON.stringify(land)));
    console.info('============= END : Update Land ===========');
  }

  async deleteLand(ctx, landId) {
    console.info('============= START : Delete Land ===========');
    await ctx.stub.deleteState(landId);
    console.info('============= END : Delete Land ===========');
  }

  async getLandByOwner(ctx, owner) {
    console.info('============= START : Get Land By Owner ===========');
    const queryString = {
      selector: {
        owner: owner
      }
    };
    const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    const results = await this.getAllResults(iterator);
    console.info('============= END : Get Land By Owner ===========');
    return results;
  }

  async getAllResults(iterator) {
    const allResults = [];
    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        const value = JSON.parse(res.value.value.toString('utf8'));
        allResults.push(value);
      }
      if (res.done) {
        await iterator.close();
        return allResults;
      }
    }
  }

}

shim.start(new LandContract());
