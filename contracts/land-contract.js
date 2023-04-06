'use strict';

const { Contract } = require('fabric-contract-api');

class LandContract extends Contract {

  async initLedger(ctx) {
    console.info('Initialized the ledger');
  }

  async createLand(ctx, landId, owner, size) {
    console.info('Creating a new land:', landId, owner, size);

    const landExists = await this.landExists(ctx, landId);
    if (landExists) {
      throw new Error(`The land ${landId} already exists`);
    }

    const land = {
      docType: 'land',
      owner,
      size,
    };

    await ctx.stub.putState(landId, Buffer.from(JSON.stringify(land)));
    console.info('Added the land to the ledger:', land);

    return land;
  }

  async readLand(ctx, landId) {
    console.info('Reading a land:', landId);

    const land = await ctx.stub.getState(landId);
    if (!land || land.length === 0) {
      throw new Error(`The land ${landId} does not exist`);
    }

    return JSON.parse(land.toString());
  }

  async updateLand(ctx, landId, newOwner, newSize) {
    console.info('Updating a land:', landId, newOwner, newSize);

    const land = await this.readLand(ctx, landId);
    land.owner = newOwner;
    land.size = newSize;

    await ctx.stub.putState(landId, Buffer.from(JSON.stringify(land)));
    console.info('Updated the land on the ledger:', land);

    return land;
  }

  async deleteLand(ctx, landId) {
    console.info('Deleting a land:', landId);

    const landExists = await this.landExists(ctx, landId);
    if (!landExists) {
      throw new Error(`The land ${landId} does not exist`);
    }

    await ctx.stub.deleteState(landId);
    console.info('Deleted the land from the ledger:', landId);
  }

  async landExists(ctx, landId) {
    const land = await ctx.stub.getState(landId);
    return land && land.length > 0;
  }

}

module.exports = LandContract;
