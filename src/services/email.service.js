const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // true for port 465, false for other ports
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  connectionTimeout: 15000, // 15 seconds
  greetingTimeout: 15000,   // 15 seconds
  socketTimeout: 15000      // 15 seconds
});

transporter.verify((error, success) => {
  if (error) {
    console.log('📧 SMTP Connection Error:', error.message);
  } else {
    console.log('📧 SMTP Server is ready to take our messages');
  }
});

const sendResetLink = async (to, token) => {
  const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`;
  await transporter.sendMail({
    from: `"HRMS Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Set Your HRMS Account Password',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#6366f1">Welcome to HRMS</h2>
        <p>Your account has been created. Click the button below to set your password.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none">Set Password</a>
        <p style="color:#888;font-size:12px;margin-top:20px">This link expires in 24 hours.</p>
      </div>`,
  });
  console.log(`📧 Reset link sent to ${to}: ${link}`);
};

const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"HRMS Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Password Reset OTP - HRMS',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#6366f1">Password Reset Request</h2>
        <p>You requested a password reset. Use the OTP below to reset your password:</p>
        <div style="background:#f3f4f6;padding:20px;border-radius:8px;text-align:center;margin:20px 0">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#6366f1">${otp}</span>
        </div>
        <p style="color:#888;font-size:12px">This OTP expires in 15 minutes.</p>
        <p style="color:#888;font-size:12px">If you didn't request this, please ignore this email.</p>
      </div>`,
  });
  console.log(`📧 OTP sent to ${to}: ${otp}`);
};

const sendActivationEmail = async (to, activationToken) => {
  // Use different URLs for development and production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseUrl = isDevelopment 
    ? 'http://localhost:3000' 
    : (process.env.FRONTEND_URL || 'https://hr-managment-system-frontend.vercel.app');
  
  const link = `${baseUrl}/activate?token=${activationToken}`;
  
  await transporter.sendMail({
    from: `"HRMS Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Activate Your HRMS Account',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#6366f1">Welcome to HRMS</h2>
        <p>Your administrator account has been created. Please click the button below to activate your account.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none">Activate Account</a>
        <p style="color:#888;font-size:12px;margin-top:20px">This activation link expires in 24 hours.</p>
        <p style="color:#888;font-size:12px">Environment: ${isDevelopment ? 'Development' : 'Production'}</p>
        <p style="color:#888;font-size:12px">If you didn't request this, please ignore this email.</p>
      </div>`,
  });
  console.log(`📧 Activation email sent to ${to}: ${link}`);
};

const sendLeaveStatusEmail = async (to, employeeName, status, leaveDetails) => {
  const statusColor = status === 'Approved' ? '#22c55e' : '#ef4444';
  const statusIcon = status === 'Approved' ? '✅' : '❌';
  
  await transporter.sendMail({
    from: `"HRMS Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: `Leave Request ${status} - HRMS`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#6366f1">Leave Request Update</h2>
        <p>Dear ${employeeName},</p>
        <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0">
          <p style="font-size:18px;font-weight:bold;color:${statusColor};margin:0 0 12px 0">
            ${statusIcon} Your leave request has been <strong>${status}</strong>
          </p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#666">Leave Type:</td><td style="padding:6px 0;font-weight:600">${leaveDetails.leaveType}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Start Date:</td><td style="padding:6px 0;font-weight:600">${new Date(leaveDetails.startDate).toLocaleDateString()}</td></tr>
            <tr><td style="padding:6px 0;color:#666">End Date:</td><td style="padding:6px 0;font-weight:600">${new Date(leaveDetails.endDate).toLocaleDateString()}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Total Days:</td><td style="padding:6px 0;font-weight:600">${leaveDetails.totalDays} day(s)</td></tr>
          </table>
        </div>
        <p style="color:#888;font-size:12px">This is an automated notification from the HRMS system.</p>
      </div>`,
  });
  console.log(`📧 Leave status email sent to ${to}: ${status}`);
};

module.exports = { sendResetLink, sendOTPEmail, sendActivationEmail, sendLeaveStatusEmail };
