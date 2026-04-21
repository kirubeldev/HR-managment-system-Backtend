const { Client } = require('pg');
const url = "postgresql://neondb_owner:npg_sNOhfZ4SW3tJ@ep-fragrant-fog-amyonyce-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

const client = new Client({
  connectionString: url,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  console.log('Testing raw PG connection...');
  try {
    await client.connect();
    console.log('✅ Raw PG connection successful');
    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Raw PG connection failed:', err.message);
  } finally {
    await client.end();
  }
})();
