
import { db } from './firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

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
