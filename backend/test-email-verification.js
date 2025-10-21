/**
 * Test script for Email Verification Service
 * Usage: node test-email-verification.js
 */

require('dotenv').config();
const emailService = require('./src/services/emailService');

async function testEmailService() {
  console.log('\n📧 Testing Email Verification Service\n');
  console.log('='.repeat(50));

  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER and EMAIL_PASS must be set in .env file');
    console.log('\nPlease add these to your .env file:');
    console.log('EMAIL_USER=98b4e4001@smtp-brevo.com');
    console.log('EMAIL_PASS=your_brevo_smtp_key');
    process.exit(1);
  }

  console.log('✓ Email credentials found');
  console.log(`  Host: ${process.env.EMAIL_HOST}`);
  console.log(`  Port: ${process.env.EMAIL_PORT}`);
  console.log(`  User: ${process.env.EMAIL_USER}`);
  console.log(`  From: ${process.env.EMAIL_FROM}\n`);

  // Test SMTP connection
  console.log('Testing SMTP connection...');
  try {
    const connectionOk = await emailService.verifyConnection();
    if (connectionOk) {
      console.log('✅ SMTP connection successful!\n');
    } else {
      console.log('❌ SMTP connection failed\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ SMTP connection error:', error.message);
    process.exit(1);
  }

  // Test PIN generation
  console.log('Testing PIN generation...');
  const pin = emailService.generateVerificationPin();
  console.log(`✅ Generated PIN: ${pin}\n`);

  // Ask if user wants to send a test email
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Would you like to send a test verification email? (y/n): ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      rl.question('Enter recipient email address: ', async (email) => {
        try {
          console.log(`\nSending test verification email to ${email}...`);
          await emailService.sendVerificationPin(email, pin, 'Test User');
          console.log('✅ Test email sent successfully!');
          console.log(`   Check ${email} for the verification PIN`);
        } catch (error) {
          console.error('❌ Failed to send test email:', error.message);
        }
        rl.close();
      });
    } else {
      console.log('\nSkipping test email send.');
      rl.close();
    }
  });
}

// Run test
testEmailService().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
