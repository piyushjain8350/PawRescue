export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { setOtp } from '@/lib/otpStore';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // Use 'true' for port 465, 'false' for 587
  auth: {
    user: '8fa798001@smtp-brevo.com',
    pass: 'IUvGXDk6Cqfgyb0Y', // Your Brevo SMTP Master Key
  },
});

function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, ...user } = body;
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const otp = generateOTP();
    await setOtp(email, {
      otp,
      user,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Email content
    await transporter.sendMail({
      from: 'jainpiyush8350@gmail.com', // Use your validated sender
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });

    return NextResponse.json({ success: true, message: 'OTP sent to email' });
  } catch (error: any) {
    // Log error to server console
    console.error('SMTP/Server error:', error);
    // Return detailed error to client for debugging
    return NextResponse.json({ message: 'Failed to send OTP', error: error?.toString(), stack: error?.stack }, { status: 500 });
  }
} 