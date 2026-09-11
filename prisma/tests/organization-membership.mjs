import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

// Exercise the real server actions against PostgreSQL; roll back every test row.
const prisma = new PrismaClient();
const rollback = new Error("ROLLBACK_MEMBERSHIP_TEST");
try {
  await prisma.$transaction(async tx => {
    const orgA = await tx.organization.create({ data: { name: "Membership test A" } });
    const orgB = await tx.organization.create({ data: { name: "Membership test B" } });
    const inactiveOrg = await tx.organization.create({ data: { name: "Membership test inactive", is_active: false } });
    const createUser = (data = {}) => tx.users.create({ data: {
      email: `${randomUUID()}@example.invalid`, password: "disabled-test-password", is_active: true, ...data,
    } });
    const applicant = await createUser();
    const supervisorA = await createUser({ organization_id: orgA.organization_id, organization_role: "SUPERVISOR" });
    const supervisorB = await createUser({ organization_id: orgB.organization_id, organization_role: "SUPERVISOR" });
    const mentorA = await createUser({ organization_id: orgA.organization_id });
    const inactiveMentor = await createUser({ organization_id: orgA.organization_id, is_active: false });
    const menteeA = await createUser({ organization_id: orgA.organization_id });
    let sessionId = applicant.user_id;
    const dependencies = {
      "next/cache": { revalidatePath() {} },
      zod: { z },
      "@/lib/auth-session": { requireMember: async () => {
        if (!sessionId) throw new Error("Unauthorized");
        return { user_id: sessionId };
      }, requireAdmin: async () => ({ user_id: supervisorA.user_id }) },
      "@/lib/prisma": { prisma: {
        organization_join_request: tx.organization_join_request,
        $transaction: async (callback, options) => {
          assert.equal(options.isolationLevel, "Serializable");
          return callback(tx);
        },
      } },
    };
    function loadActions(path) {
      const context = { exports: {}, require: name => { assert.ok(dependencies[name], name); return dependencies[name]; } };
      const source = readFileSync(new URL(path, import.meta.url), "utf8");
      vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
      return context.exports;
    }
    const actions = loadActions("../../app/dashboard/organization/actions.ts");
    const admin = loadActions("../../app/dashboard/admin/organizations/actions.ts");
    const call = (name, fields = {}, source = actions) => {
      const form = new FormData();
      for (const [key, value] of Object.entries(fields)) form.append(key, String(value));
      return source[name]({}, form);
    };
    const getUser = id => tx.users.findUniqueOrThrow({ where: { user_id: id } });
    const getRequest = () => tx.organization_join_request.findUniqueOrThrow({ where: { user_id: applicant.user_id } });
    const requestFields = request => ({ requestId: request.request_id, requestedAt: request.created_at.toISOString() });

    sessionId = null;
    for (const name of Object.keys(actions)) await assert.rejects(call(name), /Unauthorized/);
    sessionId = applicant.user_id;
    for (const organizationId of ["", "invalid", "9223372036854775808", inactiveOrg.organization_id]) {
      assert.equal((await call("requestOrganization", { organizationId })).success, false);
    }
    assert.equal((await call("selectMyMentor", { mentorId: mentorA.user_id })).success, false, "Cannot select mentor before approval");
    assert.equal((await call("requestOrganization", { organizationId: orgA.organization_id, userId: mentorA.user_id })).success, true);
    assert.equal((await getUser(applicant.user_id)).organization_id, null, "Request must not grant membership");
    let request = await getRequest();
    assert.equal(request.user_id, applicant.user_id, "Ignore forged applicant ID");
    assert.equal((await call("requestOrganization", { organizationId: orgB.organization_id })).success, false, "One pending request");
    assert.equal((await call("reviewOrganizationRequest", { ...requestFields(request), decision: "APPROVED" })).success, false, "Ordinary member cannot approve");
    sessionId = supervisorB.user_id;
    assert.equal((await call("reviewOrganizationRequest", { ...requestFields(request), decision: "APPROVED" })).success, false, "Other organization cannot approve");
    assert.equal((await call("cancelOrganizationRequest", requestFields(request))).success, false, "Cannot cancel someone else's request");
    sessionId = supervisorA.user_id;
    assert.equal((await call("reviewOrganizationRequest", { ...requestFields(request), decision: "APPROVED" })).success, true);
    assert.equal((await getUser(applicant.user_id)).organization_id, orgA.organization_id);
    assert.equal((await getRequest()).reviewed_by, supervisorA.user_id);
    assert.equal((await call("reviewOrganizationRequest", { ...requestFields(request), decision: "REJECTED" })).success, false, "Cannot process twice");

    sessionId = applicant.user_id;
    for (const mentorId of [applicant.user_id, supervisorB.user_id, inactiveMentor.user_id, "bad"]) {
      assert.equal((await call("selectMyMentor", { mentorId })).success, false);
    }
    assert.equal((await call("selectMyMentor", { mentorId: mentorA.user_id, userId: menteeA.user_id })).success, true);
    assert.equal((await getUser(applicant.user_id)).mentor_id, mentorA.user_id);
    assert.equal((await getUser(menteeA.user_id)).mentor_id, null, "Cannot change another user's mentor");
    assert.equal((await call("selectMyMentor", { mentorId: "" })).success, true);
    assert.equal((await getUser(applicant.user_id)).mentor_id, null);
    await call("selectMyMentor", { mentorId: mentorA.user_id });
    assert.equal((await call("requestOrganization", { organizationId: orgA.organization_id })).success, false);

    assert.equal((await call("requestOrganization", { organizationId: orgB.organization_id })).success, true);
    request = await getRequest();
    assert.equal((await getUser(applicant.user_id)).organization_id, orgA.organization_id);
    sessionId = supervisorB.user_id;
    assert.equal((await call("reviewOrganizationRequest", { ...requestFields(request), decision: "REJECTED" })).success, true);
    assert.equal((await getUser(applicant.user_id)).mentor_id, mentorA.user_id, "Rejection preserves mentor and membership");
    sessionId = applicant.user_id;
    assert.equal((await call("requestOrganization", { organizationId: orgB.organization_id })).success, true);
    const staleRequest = request;
    request = await getRequest();
    sessionId = supervisorB.user_id;
    assert.equal((await call("reviewOrganizationRequest", { ...requestFields(staleRequest), decision: "APPROVED" })).success, false, "Old form cannot approve a new submission");
    sessionId = applicant.user_id;
    assert.equal((await call("cancelOrganizationRequest", requestFields(request))).success, true);
    assert.equal((await getRequest()).status, "CANCELLED");
    assert.equal((await getUser(applicant.user_id)).organization_id, orgA.organization_id);

    await tx.users.update({ where: { user_id: applicant.user_id }, data: { organization_role: "SUPERVISOR" } });
    await tx.users.update({ where: { user_id: menteeA.user_id }, data: { mentor_id: applicant.user_id } });
    await call("requestOrganization", { organizationId: orgB.organization_id });
    request = await getRequest();
    sessionId = supervisorB.user_id;
    await tx.users.update({ where: { user_id: supervisorB.user_id }, data: { organization_role: "MEMBER" } });
    assert.equal((await call("reviewOrganizationRequest", { ...requestFields(request), decision: "APPROVED" })).success, false, "Recheck revoked supervisor role");
    await tx.users.update({ where: { user_id: supervisorB.user_id }, data: { organization_role: "SUPERVISOR" } });
    assert.equal((await call("reviewOrganizationRequest", { ...requestFields(request), decision: "APPROVED" })).success, true);
    const moved = await getUser(applicant.user_id);
    assert.equal(moved.organization_id, orgB.organization_id);
    assert.equal(moved.organization_role, "MEMBER");
    assert.equal(moved.mentor_id, null);
    assert.equal((await getUser(menteeA.user_id)).mentor_id, null, "Moving mentor detaches old mentees");

    sessionId = applicant.user_id;
    await call("requestOrganization", { organizationId: orgA.organization_id });
    assert.equal((await call("assignUserOrganization", { userId: applicant.user_id, organizationId: orgA.organization_id }, admin)).success, true);
    assert.equal((await getRequest()).status, "CANCELLED", "Admin override invalidates pending request");
    await tx.users.update({ where: { user_id: applicant.user_id }, data: { is_active: false } });
    assert.equal((await call("requestOrganization", { organizationId: orgB.organization_id })).success, false);
    assert.equal((await call("selectMyMentor", { mentorId: mentorA.user_id })).success, false);
    throw rollback;
  }, { isolationLevel: "Serializable", timeout: 60000 });
} catch (error) {
  if (error !== rollback) throw error;
  console.log("PASS: real database membership actions, approval/rejection, cancellation, stale requests, mentor restrictions, organization transfers, admin override, and authorization. All test data rolled back.");
} finally {
  await prisma.$disconnect();
}
