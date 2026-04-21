const { Sequelize } = require('sequelize');
const url = "postgresql://neondb_owner:npg_sNOhfZ4SW3tJ@ep-fragrant-fog-amyonyce-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sequelize = new Sequelize(url, {
  dialect: 'postgres',
  logging: true
});

(async () => {
  console.log('Testing connection...');
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:');
    console.error(error);
  } finally {
    await sequelize.close();
  }
})();
