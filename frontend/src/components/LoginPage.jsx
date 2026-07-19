import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(''); // Clear errors when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict Guard: Prevent execution if fields are empty
    if (!formData.userId.trim() || !formData.password.trim()) {
      setErrorMessage('User ID and Password are strictly required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      // Success: Save token and redirect
      localStorage.setItem('authToken', data.token);
      window.location.href = '/';
      
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Determine button disabled state dynamically
  const isFormInvalid = !formData.userId.trim() || !formData.password.trim();

  return (
    <div className="min-h-screen bg-[#140e0a] flex items-center justify-center px-4 font-sans text-white">
      <div className="w-full max-w-md bg-[#1a130e] border border-amber-950/40 p-8 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light tracking-widest uppercase text-amber-50">Account Login</h2>
          <p className="text-xs text-amber-100/50 mt-2 tracking-wide">Enter credentials to access your portal</p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 tracking-wide">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* User ID / Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-amber-100/70 tracking-wider uppercase">User ID or Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-amber-100/40">
                <User size={16} />
              </span>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Enter your User ID"
                className="w-full bg-[#251b14] border border-white/5 rounded-xl pl-11 pr-4 py-3.5 text-sm text-amber-50 placeholder-white/20 focus:outline-none focus:border-[#c27a5b] transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-amber-100/70 tracking-wider uppercase">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-amber-100/40">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-[#251b14] border border-white/5 rounded-xl pl-11 pr-12 py-3.5 text-sm text-amber-50 placeholder-white/20 focus:outline-none focus:border-[#c27a5b] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-amber-100/40 hover:text-amber-50 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isFormInvalid || loading}
            className={`w-full mt-4 flex items-center justify-center py-4 rounded-xl text-xs font-semibold tracking-widest uppercase shadow-lg transition-all duration-300 ${
              isFormInvalid 
                ? 'bg-[#251b14] text-white/20 cursor-not-allowed border border-white/5' 
                : 'bg-[#c27a5b] text-white hover:bg-[#a66345] active:scale-[0.99]'
            }`}
          >
            {loading ? <Loader2 size={16} className="animate-spin text-white" /> : 'Sign In'}
          </button>

        </form>
      </div>
    </div>
  );
}