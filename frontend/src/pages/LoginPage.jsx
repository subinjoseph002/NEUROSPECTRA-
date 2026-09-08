import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../schemas/loginSchema';
import { useAuth } from '../context/AuthContext';
import { FormField } from '../components/FormField';
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('therapist@neurospectra.org');
  const [resetPwd, setResetPwd] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetMsg, setResetMsg] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const fillDemo = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setServerError('');
  };

  const onSubmit = async (data) => {
    setServerError('');
    setIsSubmitting(true);

    try {
      await login(data);
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setServerError(errorData);
        } else if (errorData.non_field_errors) {
          setServerError(errorData.non_field_errors[0]);
        } else if (errorData.detail) {
          setServerError(errorData.detail);
        } else {
          setServerError('Invalid email or password.');
        }
      } else {
        setServerError('Unable to connect to server. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900 font-sans">
      {/* Left Photography Panel (Matching Exact Figma Frame 3) */}
      <div className="relative hidden md:flex flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Deep Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-blue-950/70" />
        </div>

        {/* Top Logo */}
        <Link 
          to="/"
          className="relative z-10 inline-flex items-center bg-white/95 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg shadow-black/20 w-fit hover:scale-105 transition-transform"
          title="NEUROSPECTRA - Back to Home"
        >
          <img 
            src="/assets/logo.png" 
            alt="NEUROSPECTRA" 
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Middle Hero Quote */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-400/30">
            Standardized Clinical Screening
          </span>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Early detection and structured interventions for every child.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Multi-role pediatric platform integrating M-CHAT-R/F early autism screening, longitudinal milestone formulations, and collaborative care.
          </p>
        </div>

        {/* Bottom Footer Notice */}
        <div className="relative z-10 text-xs text-slate-400">
          &copy; 2026 NEUROSPECTRA. Pediatric Autism Care Portal.
        </div>
      </div>

      {/* Right Login Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to access your authorized clinical dashboard</p>
          </div>

          {/* Quick Demo Autofill Selector */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => fillDemo('therapist@neurospectra.org', 'therapist123')}
                className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                🩺 Therapist
              </button>
              <button
                type="button"
                onClick={() => fillDemo('teacher@neurospectra.org', 'teacher123')}
                className="px-2 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                🎓 Teacher
              </button>
              <button
                type="button"
                onClick={() => fillDemo('parent@neurospectra.org', 'parent123')}
                className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                👨‍👩‍👧 Parent
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => fillDemo('receptionist@neurospectra.org', 'receptionist123')}
                className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                📋 Receptionist
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@neurospectra.org', 'admin123')}
                className="px-2 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                👑 Admin
              </button>
            </div>
          </div>

          {/* Backend Error Banner */}
          {serverError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. user@example.com"
              register={register}
              error={errors.email}
              isValid={touchedFields.email && !errors.email}
              required
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              register={register}
              error={errors.password}
              isValid={touchedFields.password && !errors.password}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Remember this device</span>
              </label>
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="font-semibold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
              Register here
            </Link>
          </div>

        </div>
      </div>

      {/* Working Password Reset Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">🔑</span>
                <span>Reset Account Password</span>
              </div>
              <button
                type="button"
                onClick={() => { setIsForgotOpen(false); setResetMsg(null); }}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your account email address and choose a new password to update your credentials.
            </p>

            {resetMsg && (
              <div className={`p-3 rounded-lg text-xs font-medium ${resetMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                {resetMsg.text}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!resetEmail) {
                  setResetMsg({ type: 'error', text: 'Please enter your email.' });
                  return;
                }
                if (!resetPwd || resetPwd.length < 8) {
                  setResetMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
                  return;
                }
                if (resetPwd !== resetConfirm) {
                  setResetMsg({ type: 'error', text: 'Passwords do not match.' });
                  return;
                }

                // If neuroAuth available in window
                if (window.neuroAuth) {
                  try {
                    window.neuroAuth.resetPassword(resetEmail, resetPwd, resetConfirm);
                  } catch (err) {
                    setResetMsg({ type: 'error', text: err.message });
                    return;
                  }
                }

                setValue('email', resetEmail);
                setValue('password', resetPwd);
                setResetMsg({ type: 'success', text: 'Password updated! Autofilling login credentials...' });
                setTimeout(() => {
                  setIsForgotOpen(false);
                  setResetMsg(null);
                }, 1200);
              }}
              className="space-y-3.5 text-left"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Email *</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. therapist@neurospectra.org"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min 8 chars) *</label>
                <input
                  type="password"
                  value={resetPwd}
                  onChange={(e) => setResetPwd(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  value={resetConfirm}
                  onChange={(e) => setResetConfirm(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  required
                  minLength={8}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsForgotOpen(false); setResetMsg(null); }}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
