// ✅ Fully Corrected AuthModal.tsx with Success Handling Fix
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Heart, Eye, EyeOff, RefreshCcw, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, isLoading, verifyOtp } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLoginSuccessPopup, setShowLoginSuccessPopup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false
  });

  useEffect(() => {
    if (showOtp && otpInputRef.current) {
      otpInputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showOtp]);

  useEffect(() => {
    if (showOtp) {
      setTimer(60);
      setCanResend(false);
    }
  }, [showOtp]);

  useEffect(() => {
    if (!showOtp) return;
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  useEffect(() => {
    const password = registerData.password;
    setPasswordRequirements({
      length: password.length === 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  }, [registerData.password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      toast({
        title: 'User authentication successfully and logged in',
        description: 'Welcome back!',
      });
      setLoginData({ email: '', password: '' });
      onClose();
      resetFormStates();
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password validation: exactly 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const password = registerData.password;
    if (password.length !== 8) {
      setError('Password must be exactly 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one digit');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError('Password must contain at least one special character');
      return;
    }

    const result = await register(registerData.name, registerData.email, registerData.password);
    if (result.success) {
      setError('');
      setSuccess('OTP sent to your email. Please enter it below.');
      setShowOtp(true);
      setPendingEmail(registerData.email);
    } else {
      setSuccess('');
      setError(result.error || 'Registration failed');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = await verifyOtp(pendingEmail, otp, registerData.name, registerData.password);
    if (result.success) {
      toast({
        title: 'User authentication successfully and logged in',
        description: 'You are successfully registered.',
      });
      setShowOtp(false);
      setSuccess('Registration successful! You can now log in with your email and password.');
      onClose();
      resetFormStates();
    } else {
      setError(result.error || 'OTP verification failed');
    }
  };

  const handleResendOtp = async () => {
    setCanResend(false);
    setTimer(60);
    // Call register API to resend OTP
    const result = await register(registerData.name, pendingEmail, registerData.password);
    if (result.success) {
      setSuccess('OTP resent to your email. Please enter it below.');
    } else {
      setError(result.error || 'Failed to resend OTP');
    }
  };

  const resetFormStates = () => {
    setError('');
    setSuccess('');
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowOtp(false);
    setOtp('');
    setPendingEmail('');
    setActiveTab('login');
  };

  const handleClose = () => {
    if (!showSuccessPopup && !showLoginSuccessPopup) {
      onClose();
      resetFormStates();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-600" />
              Join PawRescue
            </DialogTitle>
            <DialogDescription>
              Create an account or sign in to start helping animals find their forever homes.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {(error || success) && (
              <Alert className={success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
                <AlertDescription className={success ? 'text-green-800 font-medium' : 'text-red-800 font-medium'}>
                  {success || error}
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <InputGroup label="Email" icon={<Mail />} id="login-email" type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} disabled={isLoading} />
                <InputGroup label="Password" icon={<Lock />} id="login-password" type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} disabled={isLoading} />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing In...</>) : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              {!showOtp ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <InputGroup label="Full Name" icon={<User />} id="register-name" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} disabled={isLoading} />
                  <InputGroup label="Email" icon={<Mail />} id="register-email" type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} disabled={isLoading} />
                  <InputGroup label="Password" icon={<Lock />} id="register-password" type={showPassword ? 'text' : 'password'} value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value.slice(0, 8) })} disabled={isLoading}
                    rightIcon={showPassword ? <EyeOff className="cursor-pointer" onClick={() => setShowPassword(false)} /> : <Eye className="cursor-pointer" onClick={() => setShowPassword(true)} />}
                    maxLength={8}
                    onCopy={(e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault()}
                    onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault()}
                  />
                  
                  {/* Password Requirements */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Password Requirements:</Label>
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordRequirements.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        Exactly 8 characters
                      </div>
                      <div className={`flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordRequirements.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        At least 1 uppercase letter
                      </div>
                      <div className={`flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordRequirements.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        At least 1 lowercase letter
                      </div>
                      <div className={`flex items-center gap-2 ${passwordRequirements.digit ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordRequirements.digit ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        At least 1 digit
                      </div>
                      <div className={`flex items-center gap-2 ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordRequirements.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        At least 1 special character
                      </div>
                    </div>
                  </div>

                  <InputGroup label="Confirm Password" icon={<Lock />} id="register-confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value.slice(0, 8) })} disabled={isLoading}
                    rightIcon={showConfirmPassword ? <EyeOff className="cursor-pointer" onClick={() => setShowConfirmPassword(false)} /> : <Eye className="cursor-pointer" onClick={() => setShowConfirmPassword(true)} />}
                    maxLength={8}
                    onCopy={(e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault()}
                    onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => e.preventDefault()}
                  />
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</>) : 'Create Account'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input id="otp" type="text" placeholder="Enter the OTP sent to your email" value={otp} onChange={(e) => setOtp(e.target.value)} ref={otpInputRef} maxLength={6} />
                    <div className="flex items-center gap-2 mt-2">
                      {canResend ? (
                        <Button type="button" variant="outline" className="text-green-700 border-green-600 hover:bg-green-50" onClick={handleResendOtp}>
                          <RefreshCcw className="h-4 w-4 mr-1" /> Resend OTP
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-600">Resend OTP in {timer}s</span>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Verify OTP</Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Success Popups */}
      {/* Removed Dialogs for showSuccessPopup and showLoginSuccessPopup, as toast will be used instead */}
    </>
  );
}

// ✅ Reusable InputGroup
function InputGroup({ label, id, icon, value, onChange, disabled = false, type = 'text', rightIcon, ...inputProps }: { label: string; id: string; icon: JSX.Element; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; type?: string; rightIcon?: JSX.Element; [key: string]: any }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4">
          {icon}
        </div>
        <Input id={id} type={type} placeholder={`Enter your ${label.toLowerCase()}`} value={value} onChange={onChange} className="pl-10 pr-10" disabled={disabled} {...inputProps} />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}
