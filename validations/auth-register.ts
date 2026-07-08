import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.string().email(),

    password: z
      .string()
      .min(6),

    confirmPassword: z
      .string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message:
        "Password tidak sama",
      path: ["confirmPassword"],
    }
  );

export type RegisterForm = z.infer<
  typeof RegisterSchema
>;