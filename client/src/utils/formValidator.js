import * as yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";
// Re-usable pieces
const email = yup
  .string()
  .trim()
  .email("Enter a valid email")
  .required("Email is required");

const password = yup
  .string()
  .trim()
  .min(6, "Password must be at least 6 characters")
  .max(20, "Password too long")
  .required("Password is required");

//   sign in
export const signInSchema = yup.object({ email, password });

export const signUpSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(5, "Full name must be at least 5 characters")
    .required("First name and last name required"),
  email,
  phone: yup
    .string()
    .required("Phone number is required")
    .test("is-valid-phone", "Enter a valid phone number", (value) =>
      isValidPhoneNumber(value || "")
    ),

  password: yup
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password too long")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const resetPasswordSchema = yup.object({
  email,
});

export const newPasswordSchema = yup.object({
  password,
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

//     // PROFILE UPDATE (example with optional fields)
//     export const profileSchema = yup.object({
//     displayName: yup.string().trim().min(2, 'Display name too short').max(50, 'Display name too long').nullable(),
//     phone: yup.string().trim().matches(/^\+?[0-9\s-]{7,20}$/, 'Enter a valid phone number').nullable(),
//     bio: yup.string().trim().max(300, 'Bio must be 300 characters or less').nullable(),
//     });

//     // COMMON helper: build a resolver in components using yupResolver(schema)
//     // (we don't export a resolver here to avoid pulling @hookform/resolvers into this file)

//     // Export a default object if you prefer default import
export default {
  signInSchema,
  signUpSchema,
  // resetPasswordSchema,
  // newPasswordSchema,
  // profileSchema,
};
