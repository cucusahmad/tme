import type { Prisma } from "@prisma/client";

export const organizationMemberSelect = {
  user_id: true, email: true, is_active: true, organization_role: true,
  biodata: { select: { nama_lengkap: true } },
  mentor: { select: { email: true, biodata: { select: { nama_lengkap: true } } } },
} satisfies Prisma.usersSelect;
