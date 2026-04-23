import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, verificationLink) => {
  await transporter.sendMail({
    from: `"IsdaOK" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify Your Email (no reply)',
    html: `
      <h2>Welcome to IsdaOK!</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link expires in 5 minutes.</p>
    `,
  });
};

export const sendResetEmail = async (toEmail, resetLink) => {
  await transporter.sendMail({
    from: `"IsdaOK" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset Your Password (no reply)',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `
  });
};