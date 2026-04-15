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
    subject: 'Verify your email',
    html: `
      <h2>Welcome!</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};