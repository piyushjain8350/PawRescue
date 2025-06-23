import { promises as fs } from 'fs';
import path from 'path';

const OTP_FILE = path.join(process.cwd(), 'otpStore.json');

interface OtpRecord {
  otp: string;
  expires: number;
  user?: {
    name: string;
    email: string;
    password: string;
  };
}

type OtpStore = Record<string, OtpRecord>;

async function readStore(): Promise<OtpStore> {
  try {
    const data = await fs.readFile(OTP_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeStore(store: OtpStore): Promise<void> {
  await fs.writeFile(OTP_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export async function setOtp(email: string, otpData: OtpRecord): Promise<void> {
  const store = await readStore();
  store[email] = otpData;
  await writeStore(store);
}

export async function getOtp(email: string): Promise<OtpRecord | null> {
  const store = await readStore();
  return store[email] || null;
}

export async function deleteOtp(email: string): Promise<void> {
  const store = await readStore();
  delete store[email];
  await writeStore(store);
}

export async function isOtpValid(email: string, inputOtp: string): Promise<{ valid: boolean; error?: string }> {
  const record = await getOtp(email);
  if (!record) {
    return { valid: false, error: 'OTP not found' };
  }

  if (Date.now() > record.expires) {
    await deleteOtp(email);
    return { valid: false, error: 'OTP expired' };
  }

  if (record.otp !== inputOtp) {
    return { valid: false, error: 'Invalid OTP' };
  }

  return { valid: true };
}
