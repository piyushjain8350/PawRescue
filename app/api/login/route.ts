import { NextRequest, NextResponse } from 'next/server';

// Mock user data (replace with DB lookup in production)
const mockUsers = [
  {
    id: '1',
    email: 'admin@pawrescue.com',
    name: 'Admin User',
    role: 'admin',
    password: 'password123',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    password: 'password123',
  },
];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }
    if (user.password !== password) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
    // Don't return password in response
    const { password: _, ...userData } = user;
    return NextResponse.json({ message: 'Login successful', user: userData });
  } catch (error: any) {
    return NextResponse.json({ message: 'Login failed', error: error?.toString() }, { status: 500 });
  }
} 