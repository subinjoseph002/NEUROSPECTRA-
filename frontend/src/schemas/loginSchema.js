import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .max(100, { message: 'Email must not exceed 100 characters.' })
    .trim()
    .toLowerCase()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'Enter a valid email address.',
    }),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Password must be at least 8 characters.' })
    .refine((val) => val.trim().length > 0, {
      message: 'Password must not contain only whitespace.',
    }),
});
