const { Client } = require('pg');
const url = "postgresql://neondb_owner:npg_sYTwFxLqE26N@34.206.177.121/neondb?sslmode=require&options=endpoint%3Dep-jolly-sea-an3bte59-pooler";

const client = new Client({
  connectionString: url,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  console.log('Testing IP-based connection with SNI endpoint option...');
  try {
    await client.connect();
    console.log('✅ Success! IP-based connection worked.');
    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Failed:', err.message);
  } finally {
    await client.end();
  }
})();
