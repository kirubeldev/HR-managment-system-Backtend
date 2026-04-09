require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { sequelize } = require('./models');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();

app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://hrms-blush-iota.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/roles', require('./routes/role.routes'));
app.use('/api/permissions', require('./routes/permission.routes'));
app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/departments', require('./routes/department.routes'));
app.use('/api/audit-logs', require('./routes/auditLog.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/teaching-programs', require('./routes/teachingProgram.routes'));
app.use('/api/leaves', require('./routes/leaveRequest.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.log(err.stack || err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
  } catch (err) {
    console.log('❌ DB connection failed:', err.message);
    // Don't exit process in development, allow server to start for health check/debugging
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
    
    // WAKE-UP SCRIPT: Keep Render free tier awake by pinging itself every 5 minutes
    setInterval(() => {
      // You can replace this with your actual Render URL when deployed
      const url = process.env.NODE_ENV === 'production' 
        ? 'https://your-render-app.onrender.com/health' 
        : `http://localhost:${PORT}/health`;
        
      fetch(url)
        .then(res => console.log(`[Self-Ping] Health check status: ${res.status}`))
        .catch(err => console.log(`[Self-Ping] Error: ${err.message}`));
    }, 5 * 60 * 1000); // 5 minutes
  });
})();

module.exports = app;
