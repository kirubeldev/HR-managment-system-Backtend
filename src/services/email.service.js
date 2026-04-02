const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
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

module.exports = { sendResetLink };
