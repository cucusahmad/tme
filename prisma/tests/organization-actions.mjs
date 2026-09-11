import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { z } from "zod";

// Exercise the actual server actions with an isolated in-memory database adapter.
let authorized = true;
const rows = [
  [1n, 10n], [2n, 10n], [3n, 20n], [4n, null], [5n, 10n],
].map(([user_id, organization_id]) => ({ user_id, organization_id, role: "USER", organization_role: "MEMBER", mentor_id: null }));
const matches = (row, where) => Object.entries(where).every(([key, value]) =>
  value && typeof value === "object" ? value.in.includes(row[key]) : row[key] === value);
const tx = {
  organization_join_request: { updateMany: async () => ({ count: 0 }) },
  organization: { findUnique: async ({ where }) => [10n, 20n].includes(where.organization_id) ? { is_active: true } : null },
  users: {
    findUnique: async ({ where }) => rows.find(row => matches(row, where)),
    count: async ({ where }) => rows.filter(row => matches(row, where)).length,
    update: async ({ where, data }) => Object.assign(rows.find(row => matches(row, where)), data),
    updateMany: async ({ where, data }) => {
      const found = rows.filter(row => matches(row, where));
      found.forEach(row => Object.assign(row, data));
      return { count: found.length };
    },
  },
};
const dependencies = {
  "next/cache": { revalidatePath() {} },
  zod: { z },
  "@/lib/auth-session": { requireAdmin: async () => { if (!authorized) throw new Error("Unauthorized"); } },
  "@/lib/prisma": { prisma: { $transaction: async (callback, options) => {
    assert.equal(options.isolationLevel, "Serializable");
    return callback(tx);
  } } },
};
const context = { exports: {}, require: name => { assert.ok(dependencies[name], name); return dependencies[name]; } };
const source = readFileSync(new URL("../../app/dashboard/admin/organizations/actions.ts", import.meta.url), "utf8");
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
const call = (name, fields) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) for (const item of Array.isArray(value) ? value : [value]) form.append(key, item);
  return context.exports[name]({}, form);
};

for (const [userId, mentorId] of [["1", "3"], ["4", "2"], ["1", "1"], ["1", "999"], ["1", "invalid"]]) {
  assert.equal((await call("assignUserMentor", { userId, mentorId })).success, false);
}
assert.equal((await call("assignUserMentor", { userId: "1", mentorId: "2" })).success, true);
assert.equal(rows[0].mentor_id, 2n);
assert.equal((await call("assignUserMentor", { userId: "1", mentorId: "" })).success, true);
assert.equal(rows[0].mentor_id, null);
assert.equal((await call("saveSupervisors", { organizationId: "10", supervisorIds: ["2", "3"] })).success, false);
assert.equal((await call("saveSupervisors", { organizationId: "10", supervisorIds: ["2"] })).success, true);
assert.equal(rows[1].organization_role, "SUPERVISOR");
await call("assignUserOrganization", { userId: "2", organizationId: "10", organizationRole: "MEMBER" });
assert.equal(rows[1].organization_role, "SUPERVISOR", "Member form cannot change supervisor role");
await call("assignUserMentor", { userId: "1", mentorId: "2" });
await call("assignUserMentor", { userId: "2", mentorId: "5" });
assert.equal((await call("assignUserOrganization", { userId: "2", organizationId: "20" })).success, true);
assert.equal(rows[0].mentor_id, null, "Moving a mentor detaches old mentees");
assert.equal(rows[1].mentor_id, null, "Moving a member clears their mentor");
assert.equal(rows[1].organization_role, "MEMBER");
await call("saveSupervisors", { organizationId: "10", supervisorIds: ["1"] });
await call("saveSupervisors", { organizationId: "10", supervisorIds: [] });
assert.equal(rows[0].organization_role, "MEMBER");
await call("assignUserOrganization", { userId: "1", organizationId: "" });
assert.equal(rows[0].organization_id, null);
authorized = false;
for (const name of ["assignUserMentor", "assignUserOrganization", "saveSupervisors"]) await assert.rejects(call(name, {}), /Unauthorized/);
console.log("PASS: mentor restrictions, assignment/removal, organization moves, supervisor management, and admin authorization.");
