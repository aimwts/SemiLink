
import React, { useState } from 'react';
import { Cpu, Github, User as UserIcon, AlertCircle } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const hasSupabase = ((import.meta as any).env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);

    try {
      if (!hasSupabase) {
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

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ email: 'alex@semilink.com' });
      setLoading(false);
    }, 500);
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    const hasSupabase = ((import.meta as any).env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);
    if (!hasSupabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
       setError(err.message);
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
       <header className="px-6 md:px-12 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
           <div className="flex items-center gap-2 text-semi-700">
               <Cpu className="w-8 h-8 md:w-10 md:h-10" />
               <span className="text-2xl md:text-3xl font-bold text-semi-800 tracking-tight">SemiLink</span>
           </div>
           <div className="flex gap-4">
               {!isSignUp && (
                 <button 
                  onClick={handleGuestLogin}
                  className="hidden sm:block font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors"
                 >
                   Guest Access
                 </button>
               )}
               <button 
                onClick={() => setIsSignUp(false)}
                className="font-semibold text-blue-600 border border-blue-600 px-5 py-2 rounded-full hover:bg-blue-50 transition-colors"
               >
                   Sign in
               </button>
           </div>
       </header>

       <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-6 md:px-12 py-8 md:py-16 gap-12 lg:gap-24 items-center">
           <div className="w-full md:w-1/2 max-w-md">
               <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-8 leading-[1.15]">
                   {isSignUp ? "Make the most of your professional life" : "Welcome to your professional community"}
               </h1>

               {error && (
                 <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-center gap-2">
                   <AlertCircle className="w-4 h-4" />
                   {error}
                 </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-4">
                   {isSignUp && (
                       <div>
                           <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                           <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-400 rounded-md px-3 py-3 focus:ring-2 focus:ring-semi-600 outline-none"
                            required
                           />
                       </div>
                   )}
                   <div>
                       <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                       <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-400 rounded-md px-3 py-3 focus:ring-2 focus:ring-semi-600 outline-none"
                        required
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
                       <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-400 rounded-md px-3 py-3 focus:ring-2 focus:ring-semi-600 outline-none"
                        required
                       />
                   </div>

                   <div className="space-y-3 mt-6">
                     <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-full hover:bg-blue-700 transition-colors text-lg shadow-sm disabled:opacity-70"
                     >
                         {loading ? "Processing..." : (isSignUp ? "Agree & Join" : "Sign in")}
                     </button>

                     {!isSignUp && (
                        <button 
                          type="button"
                          onClick={handleGuestLogin}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 font-bold py-3.5 rounded-full hover:bg-blue-50 transition-colors text-lg shadow-sm"
                        >
                          <UserIcon className="w-5 h-5" />
                          Login as Guest
                        </button>
                     )}
                   </div>
               </form>

               <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-gray-500 text-sm">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
               </div>

               <button 
                 onClick={handleGithubLogin}
                 className="w-full flex items-center justify-center gap-2 border border-gray-600 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-50 transition-colors"
               >
                 <Github className="w-5 h-5" />
                 Continue with GitHub
               </button>

               <div className="mt-8 text-center pt-6">
                   {isSignUp ? (
                       <p className="text-sm text-gray-700">Already on SemiLink? <button onClick={() => setIsSignUp(false)} className="text-blue-600 font-bold hover:underline">Sign in</button></p>
                   ) : (
                       <p className="text-sm text-gray-700">New to SemiLink? <button onClick={() => setIsSignUp(true)} className="text-blue-600 font-bold hover:underline">Join now</button></p>
                   )}
               </div>
           </div>

           <div className="w-full md:w-1/2 flex justify-center">
               <div className="relative w-full max-w-lg aspect-square">
                   <img 
                    src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1000" 
                    alt="Semiconductor" 
                    className="rounded-full w-full h-full object-cover shadow-2xl"
                   />
               </div>
           </div>
       </main>
    </div>
  );
};

export default Login;
