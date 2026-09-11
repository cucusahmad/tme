import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { z } from "zod";

function load(path, dependencies) {
  const context = { exports: {}, require: name => { assert.ok(dependencies[name], name); return dependencies[name]; }, console };
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
  return context.exports;
}
const schemas = load("../../validations/biodata.ts", { zod: { z } });
let saved;
const route = load("../../app/api/profile/route.ts", {
  "@/services/biodata.service": { saveBiodata: async (userId, data) => { saved = { userId, data }; return data; } },
  "@/lib/response": { failed: (message, status) => ({ message, status }), success: data => ({ data, status: 200 }) },
  "@/lib/serializer": { serialize: value => value },
  "@/lib/jwt": { verifyToken: () => ({ user_id: "7" }) },
  "@/validations/biodata": schemas,
});
const request = body => ({ cookies: { get: () => ({ value: "session" }) }, json: async () => body });
assert.equal((await route.PUT(request({ users: { update: { organization_id: 99 } } }))).status, 400);
assert.equal(saved, undefined);
assert.equal((await route.PUT(request({
  nama_lengkap: "Test", jenis_kelamin: "Laki-laki", tempat_lahir: "Bandung",
  user_id: 99, organization_id: 99, mentor_id: 99,
  users: { update: { organization_id: 99, organization_role: "SUPERVISOR", role: "ADMIN" } },
}))).status, 200);
assert.equal(saved.userId, 7n);
for (const key of ["users", "user_id", "organization_id", "mentor_id"]) assert.equal(key in saved.data, false);
assert.equal(saved.data.nama_lengkap, "Test");
console.log("PASS: profile API rejects invalid input and strips nested user mutations and organization/mentor overrides.");
