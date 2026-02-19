# Troubleshooting: Not Receiving Reset Email

## Quick Checks

### 1. Check Render Logs
Go to your Render service → **Logs** tab and look for:
- `[Password Reset] ✅ Email sent successfully` = Email was sent
- `[Password Reset] Email not sent: SENDGRID_API_KEY or FROM_EMAIL not set` = SendGrid not configured
- `[Password Reset] ❌ SendGrid error:` = SendGrid error (see details below)

### 2. Verify Environment Variables on Render
In your Render service → **Environment**, ensure these are set:
- ✅ `SENDGRID_API_KEY` = Your SendGrid API key (starts with `SG.`)
- ✅ `FROM_EMAIL` = Verified sender email in SendGrid
- ✅ `FRONTEND_URL` = Your Netlify URL (e.g. `https://idyllic-croquembouche-614b97.netlify.app`)

### 3. Common SendGrid Errors

**Error 401 (Unauthorized)**
- ❌ Invalid API key
- ✅ Check `SENDGRID_API_KEY` matches your SendGrid API key exactly

**Error 403 (Forbidden)**
- ❌ Sender email not verified OR API key lacks permissions
- ✅ Verify `FROM_EMAIL` is verified in SendGrid (Settings → Sender Authentication)
- ✅ Ensure API key has "Mail Send" permissions

**Email goes to spam**
- ✅ Check spam/junk folder
- ✅ Mark as "Not spam" to improve deliverability
- ✅ Verify sender in SendGrid (improves reputation)

### 4. Dev Mode (Testing Without SendGrid)
If `SENDGRID_API_KEY` or `FROM_EMAIL` are not set, the reset link will appear:
- In **Render logs** (check the logs after requesting reset)
- In the **frontend response** (if running locally in dev mode)

### 5. Test the Reset Link Manually
1. Request password reset
2. Check Render logs for: `[Password Reset] Reset link (check Render logs): https://...`
3. Copy that link and paste it in your browser
4. The link format is: `https://your-netlify-app.netlify.app/reset-password?token=...`

## Step-by-Step SendGrid Setup

1. **Sign up:** [sendgrid.com](https://sendgrid.com)
2. **Verify sender:**
   - Settings → Sender Authentication → Single Sender Verification
   - Add your email (e.g. your Gmail)
   - Click verification link sent to that email
3. **Create API key:**
   - Settings → API Keys → Create API Key
   - Name: `pass-reset`
   - Permissions: **Restricted Access** → Enable **Mail Send** → **Full Access**
   - Copy the key (starts with `SG.`)
4. **Set on Render:**
   - `SENDGRID_API_KEY` = the key you copied
   - `FROM_EMAIL` = the exact verified sender email
5. **Redeploy** backend on Render

## Still Not Working?

1. **Check Render logs** immediately after requesting reset
2. **Verify** all 3 env vars are set correctly
3. **Test** SendGrid API key manually (use SendGrid's test email feature)
4. **Check spam folder** - first emails often go there
