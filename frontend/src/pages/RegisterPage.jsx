import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registrationSchema } from '../schemas/registrationSchema';
import { useAuth } from '../context/AuthContext';
import { FormField } from '../components/FormField';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { AlertCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
    defaultValues: {
      role: 'Parent / Caregiver',
      agree_terms: false,
    },
  });

  const passwordValue = watch('password', '');
  const selectedRole = watch('role', 'Parent / Caregiver');

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await registerUser(data);
      setSuccessMessage('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          // Map backend field-specific validation errors into React Hook Form
          Object.keys(errorData).forEach((field) => {
            const messages = errorData[field];
            const msg = Array.isArray(messages) ? messages[0] : messages;
            if (['full_name', 'email', 'phone', 'password', 'confirm_password', 'role', 'agree_terms'].includes(field)) {
              setError(field, { type: 'server', message: msg });
            } else {
              setServerError(msg);
            }
          });
        } else {
          setServerError(String(errorData));
        }
      } else {
        setServerError('Unable to connect to registration server. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900 font-sans">
      {/* Left Photography Panel (Matching Exact Figma Frame 4) */}
      <div className="relative hidden md:flex flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1200')`,
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

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
            Caregiver & Clinical Registration
          </span>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Join the integrated neurodevelopmental network.
          </h2>
          <div className="space-y-2.5 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Standardized 20-item M-CHAT-R/F early autism screening tool</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Individualized Education & Therapy Plan (IEP) milestone formulary</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct secure communication between parents and clinical specialists</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Notice */}
        <div className="relative z-10 text-xs text-slate-400">
          &copy; 2026 NEUROSPECTRA. Pediatric Autism Care Portal.
        </div>
      </div>

      {/* Right Registration Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-white max-h-screen overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-6">
          
          {/* Header */}
          <div className="text-left space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
            <p className="text-xs text-slate-500">Register as a parent or educator to access the pediatric portal</p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {serverError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            
            <FormField
              label="Full Name"
              name="full_name"
              placeholder="e.g. Dr. Maya Patel or Sarah Jenkins"
              register={register}
              error={errors.full_name}
              isValid={touchedFields.full_name && !errors.full_name}
              required
            />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Role Select */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Role <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800"
                >
                  <option value="Parent / Caregiver">👨‍👩‍👧 Parent / Caregiver</option>
                  <option value="Teacher">🎓 Teacher / Special Educator</option>
                  <option value="Therapist">🩺 Therapist (Admin approval)</option>
                  <option value="Receptionist">📋 Receptionist (Staff)</option>
                </select>
                {errors.role && (
                  <p className="text-[12px] font-semibold text-rose-600">{errors.role.message}</p>
                )}
              </div>

              {/* Indian Mobile Number */}
              <FormField
                label="Mobile Number"
                name="phone"
                type="tel"
                placeholder="9876543210"
                register={register}
                error={errors.phone}
                isValid={touchedFields.phone && !errors.phone}
                required
              />
            </div>

            {/* Password */}
            <div>
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
              <PasswordStrengthMeter password={passwordValue} />
            </div>

            {/* Confirm Password */}
            <FormField
              label="Confirm Password"
              name="confirm_password"
              type="password"
              placeholder="••••••••"
              register={register}
              error={errors.confirm_password}
              isValid={touchedFields.confirm_password && !errors.confirm_password}
              required
            />

            {/* Terms and Conditions Checkbox */}
            <div className="space-y-1 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-normal">
                <input
                  type="checkbox"
                  {...register('agree_terms')}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 flex-shrink-0"
                />
                <span>
                  I agree to the <a href="#" className="font-semibold text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-blue-600 hover:underline">Privacy Policy</a>.
                </span>
              </label>
              {errors.agree_terms && (
                <p className="text-[12px] font-semibold text-rose-600">{errors.agree_terms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Register Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
              Sign in here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
