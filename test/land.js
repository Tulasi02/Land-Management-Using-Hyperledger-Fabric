const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const sequelize = require('../src/db');
const Land = require('../src/models/land');

chai.use(chaiHttp);
chai.should();

describe('Land contract', () => {
  before(async () => {
    // Connect to the database and sync the model with the schema
    await sequelize.authenticate();
    await Land.sync({ force: true });
  });

  describe('POST /land', () => {
    it('should create a new land record', async () => {
      const res = await chai.request(app)
        .post('/land')
        .send({
          landID: '001',
          area: 10.5,
          latitude: 51.5074,
          longitude: 0.1278,
          value: 5000,
          owner: 'Alice'
        });

      res.should.have.status(201);
      res.body.should.have.property('message').equal('Land record created');
    });

    it('should not create a new land record with missing fields', async () => {
      const res = await chai.request(app)
        .post('/land')
        .send({
          area: 10.5,
          latitude: 51.5074,
          longitude: 0.1278,
          value: 5000,
          owner: 'Alice'
        });

      res.should.have.status(400);
      res.body.should.have.property('error').equal('Missing required fields');
    });
  });

  describe('GET /land/:landID', () => {
    it('should get a land record by ID', async () => {
      const land = await Land.create({
        landID: '001',
        area: 10.5,
        latitude: 51.5074,
        longitude: 0.1278,
        value: 5000,
        owner: 'Alice'
      });

      const res = await chai.request(app)
        .get(`/land/${land.landID}`);

      res.should.have.status(200);
      res.body.should.have.property('land');
      res.body.land.should.have.property('landID').equal('001');
    });

    it('should return an error for non-existent land ID', async () => {
      const res = await chai.request(app)
        .get('/land/invalid');

      res.should.have.status(404);
      res.body.should.have.property('error').equal('Land record not found');
    });
  });

  after(async () => {
    // Disconnect from the database
    await sequelize.close();
  });
});
