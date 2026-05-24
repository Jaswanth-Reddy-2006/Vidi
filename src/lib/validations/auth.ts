import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(100),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits").optional(),
});

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required").max(50),
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  addressLine1: z.string().min(5, "Address line 1 is required").max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country: z.string().max(50).default("India"),
  isDefault: z.boolean().default(false),
});
