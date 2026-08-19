import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password || password.length < 8) {
  throw new Error("Isi ADMIN_EMAIL dan ADMIN_PASSWORD (minimal 8 karakter) sebelum menjalankan seed.");
}

const hashedPassword = await bcrypt.hash(password, 10);

await prisma.users.upsert({
  where: { email },
  update: { password: hashedPassword, role: "ADMIN", is_active: true },
  create: { email, password: hashedPassword, role: "ADMIN", is_active: true },
});

console.log(`Akun admin ${email} siap digunakan.`);
await prisma.$disconnect();
