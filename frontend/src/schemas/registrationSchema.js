import { z } from 'zod';

export const registrationSchema = z
  .object({
    full_name: z
      .string()
      .min(1, { message: 'Full name is required.' })
      .min(3, { message: 'Full name must contain at least 3 characters.' })
      .max(100, { message: 'Full name must not exceed 100 characters.' })
      .trim()
      .regex(/^[a-zA-Z\s'-]+$/, {
        message: 'Enter a valid name.',
      }),
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .max(100, { message: 'Email must not exceed 100 characters.' })
      .trim()
      .toLowerCase()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: 'Enter a valid email address.',
      }),
    phone: z
      .string()
      .min(1, { message: 'Phone number is required.' })
      .trim()
      .transform((val) => {
        let digits = val.replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91')) {
          digits = digits.substring(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
          digits = digits.substring(1);
        }
        return digits;
      })
      .refine((val) => /^[6-9]\d{9}$/.test(val), {
        message: 'Enter a valid 10-digit mobile number.',
      }),
    role: z.enum(['Parent / Caregiver', 'Teacher', 'Therapist', 'Receptionist', 'Administrator'], {
      errorMap: () => ({ message: 'Please select a valid role.' }),
    }).default('Parent / Caregiver'),
    password: z
      .string()
      .min(1, { message: 'Password is required.' })
      .min(8, { message: 'Password must be at least 8 characters.' })
      .refine((val) => val.trim().length > 0, {
        message: 'Password must not contain only whitespace.',
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter.',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter.',
      })
      .refine((val) => /\d/.test(val), {
        message: 'Password must contain at least one number.',
      })
      .refine((val) => /[@$!%*?&#^()_+\-=\[\]{};:\'",.<>\/\\|`~]/.test(val), {
        message: 'Password must contain at least one special character.',
      }),
    confirm_password: z.string().min(1, { message: 'Please confirm your password.' }),
    agree_terms: z.literal(true, {
      errorMap: () => ({ message: 'Please accept the Terms and Conditions.' }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  });

// Password strength calculation helper for React components
export function calculatePasswordStrength(password = '') {
  if (!password) return { score: 0, label: 'None', color: 'bg-slate-200' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*?&#^()_+\-=\[\]{};:\'",.<>\/\\|`~]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
  if (score === 2 || score === 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
  return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
}
