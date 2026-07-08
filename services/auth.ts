import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .email("Email tidak valid"),

    password: z
      .string()
      .min(6, "Password minimal 6 karakter"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Password tidak sama",
    }
  );

export type RegisterInput = z.infer<
  typeof RegisterSchema
>;