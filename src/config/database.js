const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      checkServerIdentity: () => null, // Explicitly bypass hostname mismatch for IP connections
    },
    family: 4,
  },
  logging: false,
  pool: { max: 5, min: 0, acquire: 10000, idle: 10000 },
});

module.exports = sequelize;
