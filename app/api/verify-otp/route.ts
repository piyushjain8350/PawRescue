import { NextRequest, NextResponse } from 'next/server';
import { getOtp, deleteOtp, isOtpValid } from '@/lib/otpStore';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '8fa798001@smtp-brevo.com',
    pass: 'IUvGXDk6Cqfgyb0Y',
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: 'Email and OTP are required' });
    }

    const { valid, error } = await isOtpValid(email, otp);
    if (!valid) {
      return NextResponse.json({ success: false, message: error });
    }

    const record = await getOtp(email);
    if (!record || !record.user) {
      return NextResponse.json({ success: false, message: 'User info missing in OTP record' });
    }

    // Save user to DB here if needed
    const { name, password } = record.user;

    await deleteOtp(email);

    // Send registration confirmation email
    try {
      await transporter.sendMail({
        from: 'jainpiyush8350@gmail.com',
        to: email,
        subject: 'Registration Successful - Your Credentials',
        text: `You have successfully registered!\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information safe.`,
        html: `<h3>You have successfully registered!</h3><p><strong>Email:</strong> ${email}</p><p><strong>Password:</strong> ${password}</p><p>Please keep this information safe.</p>`,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don’t fail the process if email fails
    }

    return NextResponse.json({ success: true, message: 'OTP verified and registration completed' });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}
