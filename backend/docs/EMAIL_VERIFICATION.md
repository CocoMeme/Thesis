# Email Verification API Documentation

## Overview
Email verification system using PIN-based verification sent via Brevo (formerly Sendinblue) SMTP service.

## Features
- ✅ 6-digit PIN generation
- ✅ Email delivery via Brevo SMTP
- ✅ PIN expiration (10 minutes)
- ✅ Attempt limiting (5 attempts max)
- ✅ Resend functionality with cooldown
- ✅ Beautiful HTML email templates
- ✅ Welcome email after verification

## Configuration

### Environment Variables (.env)
```env
# Brevo SMTP Configuration
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=98b4e4001@smtp-brevo.com
EMAIL_PASS=your_brevo_smtp_key_here
EMAIL_FROM=noreply@gourdclassifier.com
EMAIL_FROM_NAME=Gourd Scanner
FRONTEND_URL=http://localhost:19006
```

### Get Brevo SMTP Credentials
1. Sign up at https://www.brevo.com/
2. Go to Settings > SMTP & API
3. Generate an SMTP key
4. Use provided credentials in .env

## API Endpoints

### 1. Send Verification PIN
**POST** `/api/verification/send-pin`

Request: `{ "email": "user@example.com" }`
Response: `{ "success": true, "message": "Verification PIN sent", "expiresIn": 600 }`

### 2. Verify Email with PIN
**POST** `/api/verification/verify-email`

Request: `{ "email": "user@example.com", "pin": "123456" }`
Response: `{ "success": true, "message": "Email verified successfully", "user": {...} }`

### 3. Resend Verification PIN
**POST** `/api/verification/resend-pin`

Request: `{ "email": "user@example.com" }`
Response: `{ "success": true, "message": "New PIN sent", "expiresIn": 600 }`

### 4. Check Verification Status
**GET** `/api/verification/status?email=user@example.com`

Response: `{ "success": true, "isVerified": false, "email": "user@example.com" }`

## Security Features
- 6-digit numeric PIN with 10-minute expiration
- 5 attempt limit per PIN
- 1-minute cooldown between resend requests
- PIN stored with `select: false` (not returned in queries)
- SMTP connection with TLS

## Testing
```bash
cd backend
node test-email-verification.js
```

## Frontend Integration
See full documentation for React Native integration examples.

For complete documentation, see `EMAIL_VERIFICATION.md` in this directory.
