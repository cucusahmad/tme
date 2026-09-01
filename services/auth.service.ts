import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword } from "@/lib/bcrypt";
import { generateToken } from "@/lib/jwt";

import { RegisterInput } from "@/validations/auth";
import { LoginInput } from "@/validations/auth-login";

export async function registerAccount(
  data: RegisterInput
) {
  const exist = await prisma.users.findUnique({
    where: {
      email: data.email,
    },
  });

  if (exist) {
    throw new Error("EMAIL_EXISTS");
  }

  const hashedPassword = await hashPassword(
    data.password
  );

  const user = await prisma.users.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: "USER",
      is_active: true,
    },
  });

  return user;
}

export async function loginAccount(
  data: LoginInput
) {
  const user = await prisma.users.findFirst({
    where: {
      email: {
        equals: data.email.trim(),
        mode: "insensitive",
      },
    },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIAL");
  }

  if (!user.is_active) {
    throw new Error("ACCOUNT_DISABLED");
  }

  const match = await comparePassword(
    data.password,
    user.password
  );

  if (!match) {
    throw new Error("INVALID_CREDENTIAL");
  }

  const role = user.role.trim().toUpperCase();

  const token = generateToken({
    user_id: user.user_id.toString(),
    email: user.email,
    role,
  });

  return {
    user: {
      user_id: user.user_id,
      email: user.email,
      role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    token,
  };
}
