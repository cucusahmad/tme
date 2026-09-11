import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const rollback = new Error("ROLLBACK_TEST_DATA");

try {
  await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({ data: { name: "Migration verification" } });
    const createUser = (data = {}) => tx.users.create({
      data: {
        email: `${randomUUID()}@example.invalid`,
        password: "disabled-test-account",
        is_active: false,
        organization_id: organization.organization_id,
        ...data,
      },
    });
    const supervisor = await createUser({ organization_role: "SUPERVISOR" });
    const mentor = await createUser({ mentor_id: supervisor.user_id });
    const member = await createUser({ mentor_id: mentor.user_id });
    const result = await tx.users.findUniqueOrThrow({
      where: { user_id: member.user_id },
      include: { mentor: { include: { mentor: true } }, organization: true },
    });
    assert.equal(result.organization_role, "MEMBER");
    assert.equal(result.organization.organization_id, organization.organization_id);
    assert.equal(result.mentor.mentor.user_id, supervisor.user_id);

    async function rejectsConstraint(action, constraint) {
      await tx.$executeRawUnsafe("SAVEPOINT constraint_test");
      await assert.rejects(action, (error) => String(error).includes(constraint));
      await tx.$executeRawUnsafe("ROLLBACK TO SAVEPOINT constraint_test");
      await tx.$executeRawUnsafe("RELEASE SAVEPOINT constraint_test");
    }
    await rejectsConstraint(
      () => tx.users.update({ where: { user_id: member.user_id }, data: { mentor_id: member.user_id } }),
      "chk_users_not_own_mentor",
    );
    await rejectsConstraint(
      () => tx.users.update({ where: { user_id: supervisor.user_id }, data: { organization_id: null } }),
      "chk_users_supervisor_organization",
    );
    await tx.users.delete({ where: { user_id: mentor.user_id } });
    assert.equal((await tx.users.findUniqueOrThrow({ where: { user_id: member.user_id } })).mentor_id, null);
    throw rollback;
  });
} catch (error) {
  if (error !== rollback) throw error;
  console.log("PASS: membership, supervisor, mentor chain, constraints, and mentor deletion; all test data rolled back.");
} finally {
  await prisma.$disconnect();
}
