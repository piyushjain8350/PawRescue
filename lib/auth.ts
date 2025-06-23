export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@pawrescue.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: new Date('2024-02-15'),
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Check for stored user on initialization
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('pawrescue_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // In a real app, you'd verify the password hash
    if (password !== 'password123') {
      return { success: false, error: 'Invalid password' };
    }

    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pawrescue_user', JSON.stringify(user));
    }
    this.notify();

    return { success: true };
  }

  async register(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Failed to send OTP' };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'OTP verification failed' };
      }
      // Optionally set user as logged in after verification
      this.currentUser = data.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pawrescue_user', JSON.stringify(data.user));
      }
      this.notify();
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pawrescue_user');
    }
    this.notify();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();