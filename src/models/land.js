const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Land extends Model {}

Land.init({
  landID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  area: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'land'
});

module.exports = Land;
