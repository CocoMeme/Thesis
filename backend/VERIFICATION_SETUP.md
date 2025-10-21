# Email Verification - Quick Setup Guide

## ⚠️ IMPORTANT: Add Your Brevo SMTP Key

You need to add your Brevo SMTP key to the `.env` file:

1. Open `backend/.env`
2. Find the line: `EMAIL_PASS=your_brevo_smtp_key_here`
3. Replace `your_brevo_smtp_key_here` with your actual Brevo SMTP key
4. Save the file

**To get your SMTP key:**
- Login to https://www.brevo.com/
- Go to: Settings → SMTP & API
- Click "Generate a new SMTP key"
- Copy the key and paste it in your `.env` file

## Test the Setup

```bash
cd backend
node test-email-verification.js
```

This will:
- ✅ Verify your email configuration
- ✅ Test SMTP connection
- ✅ Allow you to send a test email

## API Endpoints Ready to Use

### 1. Send PIN to Email
```bash
POST http://localhost:5000/api/verification/send-pin
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 2. Verify PIN
```bash
POST http://localhost:5000/api/verification/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "pin": "123456"
}
```

### 3. Resend PIN
```bash
POST http://localhost:5000/api/verification/resend-pin
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 4. Check Status
```bash
GET http://localhost:5000/api/verification/status?email=user@example.com
```

## What Was Implemented

### Backend Files:
1. **`src/services/emailService.js`** - Brevo email service with templates
2. **`src/controllers/verificationController.js`** - Verification logic
3. **`src/routes/verification.js`** - API routes
4. **`src/models/User.js`** - Updated with PIN fields
5. **`src/app.js`** - Registered verification routes
6. **`test-email-verification.js`** - Testing utility

### Features:
- ✅ 6-digit PIN generation
- ✅ Email sending via Brevo SMTP
- ✅ Beautiful HTML email templates
- ✅ 10-minute PIN expiration
- ✅ 5 attempt limit per PIN
- ✅ 1-minute resend cooldown
- ✅ Welcome email after verification
- ✅ Security protections

### User Model Updates:
```javascript
{
  verificationPin: String (select: false),
  verificationPinExpires: Date,
  verificationPinAttempts: Number (default: 0),
  isEmailVerified: Boolean (default: false)
}
```

## Next Steps

1. **Add your Brevo SMTP key** to `.env`
2. **Start the backend**: `npm run dev`
3. **Test the API** with Postman or cURL
4. **Integrate with frontend** (React Native)

## Need Help?

- Check `docs/EMAIL_VERIFICATION.md` for full documentation
- Run `node test-email-verification.js` to diagnose issues
- Check backend logs for error messages
