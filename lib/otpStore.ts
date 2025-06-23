import { db } from './firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { promises as fs } from 'fs';
import path from 'path';

interface OtpRecord {
  otp: string;
  expires: number;
  user?: {
    name: string;
    email: string;
    password: string;
  };
}

const COLLECTION = "otpStore";
const OTP_FILE = path.join(process.cwd(), 'otpStore.json');

export async function setOtp(email: string, otpData: OtpRecord): Promise<void> {
  const docRef = doc(db, COLLECTION, email);
  await setDoc(docRef, otpData);
}

export async function getOtp(email: string): Promise<OtpRecord | null> {
  const docRef = doc(db, COLLECTION, email);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? (snapshot.data() as OtpRecord) : null;
}

export async function deleteOtp(email: string): Promise<void> {
  const docRef = doc(db, COLLECTION, email);
  await deleteDoc(docRef);
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
