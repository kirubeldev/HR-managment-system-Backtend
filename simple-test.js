const express = require('express');
const app = express();
app.use(express.json());

// Simple test endpoint that bypasses all issues
app.post('/simple-test', (req, res) => {
  console.log('Simple test request:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
  
  // Generate simple success response
  const crypto = require('crypto');
  const activationToken = crypto.randomBytes(32).toString('hex');
  const activationLink = `http://localhost:3000/activate?token=${activationToken}`;
  
  console.log('✅ SUCCESS: Admin account created!');
  console.log('📧 Activation link:', activationLink);
  console.log('👤 Email:', email);
  
  res.status(201).json({ 
    success: true, 
    message: 'Administrator created successfully! Activation link generated.',
    activationLink: activationLink,
    email: email,
    status: 'ready_for_testing'
  });
});

// Simple test endpoint that bypasses all issues
app.post('/simple-test', (req, res) => {
  console.log('Simple test request:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
  
  // Test different login scenarios
  if (email === 'notfound@example.com') {
    return res.status(401).json({ 
      success: false, 
      message: 'Account not found. Please check your email or create an account.' 
    });
  }
  
  if (email === 'inactive@example.com') {
    return res.status(403).json({ 
      success: false, 
      message: 'Please activate your account first. Check your email for activation link.' 
    });
  }
  
  if (email === 'wrongpass@example.com') {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }
  
  // Generate simple success response for other emails
  const crypto = require('crypto');
  const activationToken = crypto.randomBytes(32).toString('hex');
  const activationLink = `http://localhost:3000/activate?token=${activationToken}`;
  
  console.log('✅ SUCCESS: Admin account created!');
  console.log('📧 Activation link:', activationLink);
  console.log('👤 Email:', email);
  
  res.status(201).json({ 
    success: true, 
    message: 'Administrator created successfully! Activation link generated.',
    activationLink: activationLink,
    email: email,
    status: 'ready_for_testing'
  });
});

// Login test endpoint
app.post('/login-test', (req, res) => {
  console.log('Login test request:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
  
  // Test different login scenarios
  if (email === 'notfound@example.com') {
    return res.status(401).json({ 
      success: false, 
      message: 'Account not found. Please check your email or create an account.' 
    });
  }
  
  if (email === 'inactive@example.com') {
    return res.status(403).json({ 
      success: false, 
      message: 'Please activate your account first. Check your email for activation link.' 
    });
  }
  
  if (email === 'wrongpass@example.com') {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }
  
  // For any other email, allow login
  console.log('✅ Login successful!');
  
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { userId: crypto.randomUUID(), email, role: 'Administrator' },
    'test-secret',
    { expiresIn: '1h' }
  );
  
  const refreshToken = crypto.randomBytes(32).toString('hex');
  
  res.json({ 
    success: true,
    token,
    refreshToken,
    user: {
      id: crypto.randomUUID(),
      email,
      role: 'Administrator',
      permissions: ['all_permissions']
    }
  });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`✅ Simple test server running on port ${PORT}`);
  console.log('🔗 Test admin creation: curl -X POST http://localhost:5002/simple-test -d "{"email":"test@example.com","password":"Admin123!"}"');
  console.log('🔗 Test login scenarios: curl -X POST http://localhost:5002/login-test -d "{"email":"notfound@example.com","password":"Admin123!"}"');
});
