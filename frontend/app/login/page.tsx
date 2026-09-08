'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  ShieldCheck, 
  Users, 
  Leaf, 
  MapPin, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = activeTab === 'signin' ? '/api/auth/signin' : '/api/auth/signup';
      const body = activeTab === 'signin' ? { email, password } : { name, email, password };
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      // Save user to localStorage for route protection
      localStorage.setItem('floodtwin_user', JSON.stringify(data.user));

      toast.success(data.message || (activeTab === 'signin' ? 'Signed in successfully!' : 'Account created successfully!'));
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google Authentication will be implemented in the next phase.');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* LEFT PANEL - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 text-white overflow-hidden flex-col justify-between p-12">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/30" />
        
        {/* Content Top */}
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-blue-500 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">FloodTwin</h1>
              <p className="text-sm text-slate-300">Safer Cities. Smarter Decisions.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-medium text-slate-100 mb-10 leading-snug">
            AI-powered urban flood intelligence <br />for a resilient Mumbai.
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Real-time Monitoring</h3>
                <p className="text-sm text-slate-400">Live sensor data across the city</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Early Warning</h3>
                <p className="text-sm text-slate-400">AI-driven flood predictions</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Faster Response</h3>
                <p className="text-sm text-slate-400">Coordinated municipal action</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <Leaf className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Safer Communities</h3>
                <p className="text-sm text-slate-400">A more resilient Mumbai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Bottom removed as per request */}
      </div>

      {/* RIGHT PANEL - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        {/* Faint background image on the right panel */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555529733-0e67056058ab?q=80&w=1000&auto=format&fit=crop')" }}
        />
        <div className="w-full max-w-[440px] relative z-10">
          {/* Mobile Logo (hidden on desktop) */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="h-8 w-8 bg-blue-600 rounded-tl-lg rounded-br-lg rounded-tr-sm rounded-bl-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">FloodTwin</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'signin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Create Account
              </button>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {activeTab === 'signin' 
                    ? 'Sign in to access the FloodTwin dashboard' 
                    : 'Register to access municipal flood management tools'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                {activeTab === 'signup' && (
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                      placeholder="Email address (e.g. officer@municipal.gov.in)"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {activeTab === 'signin' && (
                    <div className="mt-2 text-right">
                      <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Forgot password?
                      </a>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'Processing...' : (activeTab === 'signin' ? 'Sign In' : 'Sign Up')}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">or</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-500">
                {activeTab === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button onClick={() => setActiveTab('signup')} className="font-medium text-blue-600 hover:text-blue-500">
                      Create account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button onClick={() => setActiveTab('signin')} className="font-medium text-blue-600 hover:text-blue-500">
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Alert */}
            <div className="bg-slate-50/80 p-6 border-t border-slate-100 flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Secure municipal access</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your data is protected and used only for authorized flood management operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
