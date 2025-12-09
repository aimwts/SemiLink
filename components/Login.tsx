/// <reference types="vite/client" />
import React, { useState } from 'react';
import { Cpu, Briefcase, Globe, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginProps {
  onLogin: (userData?: { name?: string; email: string }) => void; // Keeping prop for backward compatibility/mock fallback
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

    // Safe check for Supabase configuration
    const hasSupabase = (import.meta.env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);

    try {
      if (!hasSupabase) {
        // Fallback to Mock if no supabase keys
        console.warn("No Supabase keys found. Using Mock Login.");
        setTimeout(() => {
          onLogin(isSignUp ? { name, email } : { email });
          setLoading(false);
        }, 800);
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
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
        // Supabase Auth listener in App.tsx will handle the state change
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Supabase Auth listener in App.tsx will handle the state change
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
       {/* Public Header */}
       <header className="px-6 md:px-12 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
           <div className="flex items-center gap-2 text-semi-700">
               <Cpu className="w-8 h-8 md:w-10 md:h-10" />
               <span className="text-2xl md:text-3xl font-bold text-semi-800 tracking-tight">SemiLink</span>
           </div>
           <div className="flex gap-3 md:gap-4">
               <button 
                onClick={() => setIsSignUp(true)}
                className="font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 hover:bg-gray-100 rounded-full transition-colors text-sm md:text-base"
               >
                   Join now
               </button>
               <button 
                onClick={() => setIsSignUp(false)}
                className="font-semibold text-blue-600 border border-blue-600 px-5 py-2 rounded-full hover:bg-blue-50 transition-colors text-sm md:text-base"
               >
                   Sign in
               </button>
           </div>
       </header>

       <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-6 md:px-12 py-8 md:py-16 gap-12 lg:gap-24 items-center">
           {/* Left Column - Form */}
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
                            className="w-full border border-gray-400 rounded-md px-3 py-3 focus:ring-2 focus:ring-semi-600 focus:border-transparent outline-none transition-all"
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
                        className="w-full border border-gray-400 rounded-md px-3 py-3 focus:ring-2 focus:ring-semi-600 focus:border-transparent outline-none transition-all"
                        required
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
                       <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-400 rounded-md px-3 py-3 focus:ring-2 focus:ring-semi-600 focus:border-transparent outline-none transition-all"
                        required
                       />
                   </div>
                   
                   <p className="text-xs text-gray-500 mt-2">
                       By clicking {isSignUp ? "Agree & Join" : "Sign in"}, you agree to the SemiLink User Agreement, Privacy Policy, and Cookie Policy.
                   </p>

                   <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-full hover:bg-blue-700 transition-colors mt-6 text-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                       {loading ? "Processing..." : (isSignUp ? "Agree & Join" : "Sign in")}
                   </button>
               </form>

               {!import.meta.env?.VITE_SUPABASE_URL && !process.env.VITE_SUPABASE_URL && (
                 <div className="mt-4 p-3 bg-blue-50 text-xs text-blue-800 rounded border border-blue-100">
                    <p className="font-semibold mb-1">Mock Accounts (if no Supabase keys):</p>
                    <p>sarah@semilink.com / 123456</p>
                    <p className="mt-2 text-gray-500 italic">To use real DB, set VITE_SUPABASE_URL in .env</p>
                 </div>
               )}

               <div className="mt-8 text-center border-t border-gray-200 pt-6">
                   {isSignUp ? (
                       <p className="text-sm text-gray-700">Already on SemiLink? <button onClick={() => setIsSignUp(false)} className="text-blue-600 font-bold hover:underline">Sign in</button></p>
                   ) : (
                       <p className="text-sm text-gray-700">New to SemiLink? <button onClick={() => setIsSignUp(true)} className="text-blue-600 font-bold hover:underline">Join now</button></p>
                   )}
               </div>
           </div>

           {/* Right Column - Hero Image */}
           <div className="w-full md:w-1/2 flex justify-center relative">
               <div className="relative w-full max-w-lg aspect-square">
                   <img 
                    src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1000" 
                    alt="Semiconductor wafer" 
                    className="rounded-full w-full h-full object-cover shadow-2xl relative z-10"
                   />
                   
                   {/* Decorative circle */}
                   <div className="absolute top-4 -right-4 w-full h-full rounded-full border border-gray-200 z-0"></div>

                   {/* Floating cards for effect */}
                   <div className="absolute -left-4 md:-left-12 top-20 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center gap-3 animate-[float_4s_ease-in-out_infinite] z-20 max-w-[200px]">
                       <div className="bg-orange-100 p-2.5 rounded-lg">
                           <Briefcase className="w-6 h-6 text-orange-600" />
                       </div>
                       <div>
                           <p className="text-sm font-bold text-gray-800 leading-tight">Job Alert</p>
                           <p className="text-xs text-gray-500 truncate w-24">Process Eng @ TSMC</p>
                       </div>
                   </div>

                   <div className="absolute -right-4 md:-right-8 bottom-32 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center gap-3 animate-[float_5s_ease-in-out_infinite_1s] z-20">
                       <div className="bg-blue-100 p-2.5 rounded-lg">
                           <Globe className="w-6 h-6 text-blue-600" />
                       </div>
                       <div>
                           <p className="text-sm font-bold text-gray-800 leading-tight">Global Network</p>
                           <p className="text-xs text-gray-500">Connect with experts</p>
                       </div>
                   </div>
               </div>
           </div>
       </main>
       
       <footer className="bg-white py-6 border-t border-gray-100">
           <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
               <div className="flex gap-4">
                   <span>SemiLink © 2024</span>
                   <a href="#" className="hover:underline">User Agreement</a>
                   <a href="#" className="hover:underline">Privacy Policy</a>
                   <a href="#" className="hover:underline">Community Guidelines</a>
               </div>
               <div className="flex gap-4">
                   <a href="#" className="hover:underline">Cookie Policy</a>
                   <a href="#" className="hover:underline">Copyright Policy</a>
                   <a href="#" className="hover:underline">Send Feedback</a>
               </div>
           </div>
       </footer>
    </div>
  );
};

export default Login;