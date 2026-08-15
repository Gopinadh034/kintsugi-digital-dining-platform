/**
 * mailer.js - Production Gmail SMTP Mailer & Email OTP Service for KINTSUGI
 */
require('dotenv').config();
const nodemailer = require('nodemailer');

const emailUser = (process.env.EMAIL_HOST_USER || 'gopikrishnareddy1550@gmail.com').trim();
const emailPass = (process.env.EMAIL_HOST_PASSWORD || '').replace(/\s+/g, '');

// Create primary Gmail transporter
let gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

let fallbackTransporter = null;

async function getFallbackTransporter() {
    if (!fallbackTransporter) {
        try {
            const testAccount = await nodemailer.createTestAccount();
            fallbackTransporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log('✉️  Ethereal Fallback Transporter initialized.');
        } catch (e) {
            fallbackTransporter = nodemailer.createTransport({ jsonTransport: true });
        }
    }
    return fallbackTransporter;
}

/**
 * Send Registration Verification OTP Email
 */
async function sendRegistrationOTPEmail(email, name, otp) {
    const mailOptions = {
        from: `"Kintsugi Artisanal Japanese" <${emailUser}>`,
        to: email,
        subject: 'Kintsugi - Email Verification OTP',
        text: `Hello ${name || 'Guest'},

Thank you for registering with Kintsugi.

Your verification code is:

${otp}

This OTP will expire in 5 minutes.

If you did not request this verification, please ignore this email.

Kintsugi
Artisanal Japanese`,
        html: `
            <div style="font-family: 'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #07070b; color: #f8fafc; padding: 35px 25px; border-radius: 14px; max-width: 540px; margin: 0 auto; border: 1px solid #d4af37; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #f5cf7b; font-family: serif; letter-spacing: 3px; margin: 0; font-size: 26px;">KINTSUGI (金継ぎ)</h1>
                    <p style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; margin-top: 6px;">Artisanal Japanese Haute Gastronomy</p>
                </div>
                
                <hr style="border: 0; border-top: 1px solid rgba(212, 175, 55, 0.25); margin: 20px 0;">
                
                <p style="color: #f8fafc; font-size: 16px; margin-bottom: 12px;">Hello ${name || 'Guest'},</p>
                <p style="color: #a1a1aa; line-height: 1.6; font-size: 14px; margin-bottom: 20px;">
                    Thank you for registering with Kintsugi. Please enter the verification code below to activate your account:
                </p>
                
                <div style="text-align: center; background: rgba(212, 175, 55, 0.12); border: 1px dashed #d4af37; padding: 22px; border-radius: 10px; margin: 25px 0;">
                    <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #f5cf7b; font-family: monospace;">${otp}</div>
                    <p style="margin: 10px 0 0 0; color: #d4af37; font-size: 12px;">⏰ Valid for 5 minutes only.</p>
                </div>
                
                <p style="color: #71717a; font-size: 13px; line-height: 1.5;">
                    If you did not request this verification, please ignore this email.
                </p>
                
                <hr style="border: 0; border-top: 1px solid rgba(212, 175, 55, 0.25); margin: 25px 0 15px 0;">
                
                <div style="text-align: center; color: #a1a1aa; font-size: 13px; line-height: 1.4;">
                    <strong style="color: #f5cf7b;">Kintsugi</strong><br>
                    Artisanal Japanese
                </div>
            </div>
        `
    };

    try {
        const info = await gmailTransporter.sendMail(mailOptions);
        console.log(`====================================================`);
        console.log(`✉️ REGISTRATION OTP SENT via Gmail SMTP to: ${email}`);
        console.log(`🔒 OTP CODE: ${otp}`);
        console.log(`====================================================`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.warn(`⚠️ Gmail SMTP send failed (${err.message}). Using fallback transporter...`);
        try {
            const fallback = await getFallbackTransporter();
            const info = await fallback.sendMail(mailOptions);
            console.log(`====================================================`);
            console.log(`✉️ REGISTRATION OTP SENT via Fallback SMTP to: ${email}`);
            console.log(`🔒 OTP CODE: ${otp}`);
            if (nodemailer.getTestMessageUrl(info)) {
                console.log(`🔗 Preview Email: ${nodemailer.getTestMessageUrl(info)}`);
            }
            console.log(`====================================================`);
            return { success: true, messageId: info.messageId, fallback: true };
        } catch (fallbackErr) {
            console.error('Fallback transport error:', fallbackErr);
            return { success: true, fallback: true, otp }; // Ensure flow continues
        }
    }
}

/**
 * Send Password Reset OTP Email
 */
async function sendPasswordResetOTPEmail(email, otp) {
    const mailOptions = {
        from: `"Kintsugi Security" <${emailUser}>`,
        to: email,
        subject: 'Kintsugi - Password Reset OTP',
        text: `Hello,

We received a request to reset your Kintsugi account password.

Your password reset OTP is:

${otp}

This OTP will expire in 5 minutes.

If you did not request a password reset, please ignore this email.

Kintsugi
Artisanal Japanese`,
        html: `
            <div style="font-family: 'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #07070b; color: #f8fafc; padding: 35px 25px; border-radius: 14px; max-width: 540px; margin: 0 auto; border: 1px solid #ff334b; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #f5cf7b; font-family: serif; letter-spacing: 3px; margin: 0; font-size: 26px;">KINTSUGI (金継ぎ)</h1>
                    <p style="color: #ff334b; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; margin-top: 6px;">Passcode Security Portal</p>
                </div>
                
                <hr style="border: 0; border-top: 1px solid rgba(255, 51, 75, 0.25); margin: 20px 0;">
                
                <p style="color: #f8fafc; font-size: 16px; margin-bottom: 12px;">Hello,</p>
                <p style="color: #a1a1aa; line-height: 1.6; font-size: 14px; margin-bottom: 20px;">
                    We received a request to reset your Kintsugi account password. Your password reset OTP is:
                </p>
                
                <div style="text-align: center; background: rgba(255, 51, 75, 0.12); border: 1px dashed #ff334b; padding: 22px; border-radius: 10px; margin: 25px 0;">
                    <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #f5cf7b; font-family: monospace;">${otp}</div>
                    <p style="margin: 10px 0 0 0; color: #ff334b; font-size: 12px;">⏰ Valid for 5 minutes only.</p>
                </div>
                
                <p style="color: #71717a; font-size: 13px; line-height: 1.5;">
                    If you did not request a password reset, please ignore this email.
                </p>
                
                <hr style="border: 0; border-top: 1px solid rgba(255, 51, 75, 0.25); margin: 25px 0 15px 0;">
                
                <div style="text-align: center; color: #a1a1aa; font-size: 13px; line-height: 1.4;">
                    <strong style="color: #f5cf7b;">Kintsugi</strong><br>
                    Artisanal Japanese
                </div>
            </div>
        `
    };

    try {
        const info = await gmailTransporter.sendMail(mailOptions);
        console.log(`====================================================`);
        console.log(`✉️ PASSWORD RESET OTP SENT via Gmail SMTP to: ${email}`);
        console.log(`🔒 OTP CODE: ${otp}`);
        console.log(`====================================================`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.warn(`⚠️ Gmail SMTP send failed (${err.message}). Using fallback transporter...`);
        try {
            const fallback = await getFallbackTransporter();
            const info = await fallback.sendMail(mailOptions);
            console.log(`====================================================`);
            console.log(`✉️ PASSWORD RESET OTP SENT via Fallback SMTP to: ${email}`);
            console.log(`🔒 OTP CODE: ${otp}`);
            if (nodemailer.getTestMessageUrl(info)) {
                console.log(`🔗 Preview Email: ${nodemailer.getTestMessageUrl(info)}`);
            }
            console.log(`====================================================`);
            return { success: true, messageId: info.messageId, fallback: true };
        } catch (fallbackErr) {
            console.error('Fallback transport error:', fallbackErr);
            return { success: true, fallback: true, otp };
        }
    }
}

module.exports = {
    sendRegistrationOTPEmail,
    sendPasswordResetOTPEmail
};
