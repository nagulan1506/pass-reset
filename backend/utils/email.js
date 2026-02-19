import sgMail from '@sendgrid/mail';

export const sendPasswordResetEmail = async (to, resetUrl) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set – skipping email. Reset link:', resetUrl);
    return;
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: to,
    from: process.env.FROM_EMAIL || 'noreply@example.com',
    subject: 'Password Reset – Secure Link',
    text: `You requested a password reset. Click the link below (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Password Reset</h2>
        <p>You requested a password reset. Click the button below (link is valid for 1 hour):</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4361ee; color: #fff; text-decoration: none; border-radius: 8px;">Reset Password</a>
        </p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };
  await sgMail.send(msg);
};
