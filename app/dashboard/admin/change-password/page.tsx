import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { requireAdmin } from "@/lib/auth-session";

export default async function AdminChangePasswordPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Ubah Password</h1>
        <p className="mt-2 text-slate-500">Kelola keamanan akun administrator Anda.</p>
      </div>
      <ChangePasswordForm admin />
    </div>
  );
}
