const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Role } = require('./src/models');

const app = express();
app.use(express.json());

// Simple test endpoint
app.post('/test-bootstrap', async (req, res) => {
  try {
    console.log('Test request body:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Try to find admin role
    const adminRole = await Role.findOne({ where: { name: 'ADMINISTRATOR' } });
    if (!adminRole) {
      return res.status(400).json({ 
        success: false, 
        message: 'Administrator role not found' 
      });
    }
    
    console.log('Found admin role:', adminRole);
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { roleId: adminRole.id } });
    if (existingUser) {
      return res.status(403).json({ 
        success: false, 
        message: 'Administrator already exists' 
      });
    }
    
    // Create new admin
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      passwordHash,
      roleId: adminRole.id,
      isActive: false
    });
    
    console.log('Created user:', user.email);
    
    res.status(201).json({ 
      success: true, 
      message: 'Administrator created successfully',
      user: { email: user.email, id: user.id }
    });
    
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message,
      error: err.stack 
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
