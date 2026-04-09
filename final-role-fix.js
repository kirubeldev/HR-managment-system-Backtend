const { User, Role, Permission, sequelize } = require('./src/models');

async function finalRoleFix() {
  try {
    console.log('--- FINAL ROLE AND PERMISSION CORRECTION ---');
    
    const targetRoleId = '11111111-1111-1111-1111-000000000001';
    
    // 1. Find or Create the Administrator role with the specific ID from the user's log
    let role = await Role.findByPk(targetRoleId);
    if (!role) {
      console.log('Role not found by ID, creating Administrator role with that ID...');
      role = await Role.create({
        id: targetRoleId,
        name: 'Administrator'
      });
    } else {
      console.log(`Role found: ${role.name}. Renaming to Administrator...`);
      role.name = 'Administrator';
      await role.save();
    }

    // 2. Fetch all available permissions
    const perms = await Permission.findAll();
    console.log(`Found ${perms.length} permissions in database.`);

    // 3. Link all permissions to this role
    await role.setPermissions(perms);
    console.log(`✅ Linked all ${perms.length} permissions to the Administrator role.`);

    // 4. Ensure our test user is correctly assigned to this role and is active
    const userEmail = 'kirubelmenberu399@gmail.com';
    const user = await User.findOne({ where: { email: userEmail } });
    if (user) {
      user.roleId = role.id;
      user.isActive = true;
      await user.save();
      console.log(`✅ User ${userEmail} verified and linked to Administrator role.`);
    } else {
      console.log(`⚠️ User ${userEmail} not found in DB!`);
    }

    // 5. Final check: Does the user's role include permissions now?
    const checkUser = await User.findOne({
      where: { email: userEmail },
      include: [{ model: Role, as: 'role', include: [{ model: Permission, as: 'permissions' }] }]
    });
    
    if (checkUser && checkUser.role) {
      console.log(`Final Verification: User ${userEmail} has ${checkUser.role.permissions.length} permissions.`);
    }

    console.log('--- ALL SYSTEMS SYNCED ---');
  } catch (err) {
    console.log('❌ Fix failed:', err.message);
    if (err.errors) console.log(err.errors.map(e => e.message).join(', '));
  } finally {
    process.exit();
  }
}

finalRoleFix();
