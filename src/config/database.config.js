require('dotenv').config();

const isSqlite = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sqlite');

const config = {
  url: process.env.DATABASE_URL,
  dialect: isSqlite ? 'sqlite' : 'postgres',
  logging: false,
};

if (isSqlite) {
  config.storage = './hrms_staging.sqlite';
} else {
  config.dialectOptions = {
    ssl: { 
      require: true, 
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined 
    },
    connectTimeout: 60000,
  };
  config.pool = { max: 5, min: 0, acquire: 60000, idle: 10000 };
  config.retry = { max: 3 };
}

module.exports = {
  development: config,
  production: config,
};
