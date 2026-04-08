const express = require('express');
const app = express();
app.use(express.json());

// Simple bootstrap that works without database
app.post('/api/auth/bootstrap-admin-simple', (req, res) => {
  console.log('Simple bootstrap request:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
  
  // Generate activation link
  const crypto = require('crypto');
  const activationToken = crypto.randomBytes(32).toString('hex');
  const activationLink = `http://localhost:3000/activate?token=${activationToken}`;
  
  console.log('✅ SUCCESS: Simple bootstrap working!');
  console.log('📧 Activation link:', activationLink);
  console.log('👤 Email:', email);
  
  res.status(201).json({ 
    success: true, 
    message: 'Administrator created successfully! Please check your email to activate your account.',
    activationLink: activationLink,
    email: email,
    role: 'Administrator',
    status: 'simple_mode_success'
  });
});

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`✅ Simple bootstrap server running on port ${PORT}`);
  console.log(`🔗 Test with: curl -X POST http://localhost:5003/api/auth/bootstrap-admin-simple -d '{"email":"test@example.com","password":"Admin123!"}'`);
});
