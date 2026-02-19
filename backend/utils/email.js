import sgMail from '@sendgrid/mail';

export const sendPasswordResetEmail = async (to, resetUrl) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn(
      '[Password Reset] Email not sent: SENDGRID_API_KEY or FROM_EMAIL not set on Render.'
    );
    console.warn('[Password Reset] Reset link (check Render logs):', resetUrl);
    return false; // Return false to indicate email wasn't sent
  }

  sgMail.setApiKey(apiKey);
  const msg = {
    to: to,
    from: fromEmail,
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

  try {
    const result = await sgMail.send(msg);
    console.log('[Password Reset] ✅ Email sent successfully to', to);
    console.log('[Password Reset] SendGrid status:', result[0]?.statusCode);
    return true; // Email was sent
  } catch (err) {
    console.error('[Password Reset] ❌ SendGrid error:');
    console.error('[Password Reset] Status:', err.code);
    console.error('[Password Reset] Message:', err.message);
    if (err.response) {
      console.error('[Password Reset] Response body:', JSON.stringify(err.response.body, null, 2));
    }
    // Common issues:
    if (err.code === 401) {
      console.error('[Password Reset] ⚠️  Invalid API key. Check SENDGRID_API_KEY on Render.');
    } else if (err.code === 403) {
      console.error('[Password Reset] ⚠️  API key lacks permissions or sender not verified. Check FROM_EMAIL is verified in SendGrid.');
    }
    return false; // Email was not sent
  }
};
