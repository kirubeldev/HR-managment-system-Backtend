const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// The "from" address must be a verified domain on Resend.
// Until you verify a custom domain, use Resend's shared domain:
//   onboarding@resend.dev  (only sends to the account owner's email)
// Once you verify your domain (e.g. hrms.yourdomain.com), change this to:
//   "HRMS Admin" <noreply@yourdomain.com>
const FROM_ADDRESS = process.env.EMAIL_FROM || 'HRMS Admin <onboarding@resend.dev>';

const sendResetLink = async (to, token) => {
  const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
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
  if (error) throw new Error(`Resend error: ${error.message}`);
  console.log(`📧 Reset link sent to ${to}: ${link} (id: ${data.id})`);
};

const sendOTPEmail = async (to, otp) => {
  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
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
  if (error) throw new Error(`Resend error: ${error.message}`);
  console.log(`📧 OTP sent to ${to}: ${otp} (id: ${data.id})`);
};

const sendActivationEmail = async (to, activationToken) => {
  const baseUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : (process.env.FRONTEND_URL || 'https://oicethiopiahrms.vercel.app');

  const link = `${baseUrl}/activate?token=${activationToken}`;

  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: 'Activate Your HRMS Account',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#6366f1">Welcome to HRMS</h2>
        <p>Your administrator account has been created. Please click the button below to activate your account.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none">Activate Account</a>
        <p style="color:#888;font-size:12px;margin-top:20px">This activation link expires in 24 hours.</p>
        <p style="color:#888;font-size:12px">If you didn't request this, please ignore this email.</p>
      </div>`,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
  console.log(`📧 Activation email sent to ${to}: ${link} (id: ${data.id})`);
};

const sendLeaveStatusEmail = async (to, employeeName, status, leaveDetails) => {
  const statusColor = status === 'Approved' ? '#22c55e' : '#ef4444';
  const statusIcon = status === 'Approved' ? '✅' : '❌';

  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
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
  if (error) throw new Error(`Resend error: ${error.message}`);
  console.log(`📧 Leave status email sent to ${to}: ${status} (id: ${data.id})`);
};

module.exports = { sendResetLink, sendOTPEmail, sendActivationEmail, sendLeaveStatusEmail };
