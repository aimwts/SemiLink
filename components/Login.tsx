import React, { useState } from 'react';
import { 
  Cpu, 
  Github, 
  User as UserIcon, 
  AlertCircle, 
  Chrome, 
  Linkedin, 
  Facebook, 
  Monitor, 
  Eye, 
  EyeOff,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginProps {
  onLogin: (userData?: { name?: string; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const hasSupabase = ((import.meta as any).env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!hasSupabase) {
        // Fallback for demo without Supabase configured
        setTimeout(() => {
          onLogin(isSignUp ? { name, email } : { email });
          setLoading(false);
        }, 800);
        return;
      }

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`
            }
          }
        });
        if (error) throw error;
        setError("Please check your email for a verification link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google' | 'linkedin_oidc' | 'azure' | 'facebook') => {
    setLoading(true);
    setError(null);
    
    if (!hasSupabase) {
      // Mock OAuth behavior for demo
      setTimeout(() => {
        onLogin({ email: `oauth_user@${provider}.com`, name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User` });
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { 
          redirectTo: window.location.origin,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : undefined
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ email: 'alex@semilink.com' });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-semi-50 rounded-2xl">
                <Cpu className="w-10 h-10 text-semi-700" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-[#1A1D23] tracking-tight mb-2">
              {isSignUp ? "Create Account" : "Log In"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isSignUp 
                ? "Join the professional semiconductor network" 
                : "Log into your account with your account information"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#F3F6F9] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-semi-500 outline-none transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-[#F3F6F9] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-semi-500 outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#F3F6F9] border-none rounded-xl px-4 py-3.5 pr-12 focus:ring-2 focus:ring-semi-500 outline-none transition-all placeholder:text-gray-400"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button type="button" className="text-sm font-medium text-semi-600 hover:text-semi-700 transition-colors">
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#242938] text-white font-bold py-4 rounded-xl hover:bg-[#1A1E29] transition-all shadow-lg shadow-gray-200 disabled:opacity-70 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Log In")}
              {!loading && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-medium tracking-wider">Connect with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <SocialButton 
              icon={<Chrome className="w-5 h-5 text-[#4285F4]" />} 
              label={`${isSignUp ? 'Sign up' : 'Log in'} with Google`} 
              onClick={() => handleOAuthLogin('google')}
            />
            <SocialButton 
              icon={<Linkedin className="w-5 h-5 text-[#0A66C2]" />} 
              label={`${isSignUp ? 'Sign up' : 'Log in'} with LinkedIn`} 
              onClick={() => handleOAuthLogin('linkedin_oidc')}
            />
            <SocialButton 
              icon={<Monitor className="w-5 h-5 text-[#00A4EF]" />} 
              label={`${isSignUp ? 'Sign up' : 'Log in'} with Microsoft`} 
              onClick={() => handleOAuthLogin('azure')}
            />
            <SocialButton 
              icon={<Facebook className="w-5 h-5 text-[#1877F2]" />} 
              label={`${isSignUp ? 'Sign up' : 'Log in'} with Meta`} 
              onClick={() => handleOAuthLogin('facebook')}
            />
            <SocialButton 
              icon={<Github className="w-5 h-5 text-[#1B1F23]" />} 
              label={`${isSignUp ? 'Sign up' : 'Log in'} with GitHub`} 
              onClick={() => handleOAuthLogin('github')}
            />
          </div>

          <button 
            onClick={handleGuestLogin}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl hover:border-semi-400 hover:text-semi-600 hover:bg-semi-50 transition-all font-semibold"
          >
            <UserIcon className="w-5 h-5" />
            Continue as Guest
          </button>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-semi-700 font-bold hover:underline transition-all"
              >
                {isSignUp ? "Log In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group"
  >
    <div className="group-hover:scale-110 transition-transform duration-200">
      {icon}
    </div>
    <span className="text-sm font-semibold text-[#444B59]">{label}</span>
  </button>
);

export default Login;