const { User, Role } = require('./src/models');

async function checkUser() {
  try {
    const email = 'kirubelmenberu399@gmail.com';
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      console.log('User not found');
    } else {
      console.log('User found:');
      console.log('Email:', user.email);
      console.log('IsActive:', user.isActive);
      console.log('IsDeleted:', user.isDeleted);
      console.log('Role:', user.role ? user.role.name : 'No role');
      console.log('Branch:', user.branch);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

checkUser();
