const { Permission } = require('./src/models');

async function listPermissions() {
  try {
    const perms = await Permission.findAll();
    console.log('Permissions in DB:');
    perms.forEach(p => console.log(`- ${p.name}`));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

listPermissions();
