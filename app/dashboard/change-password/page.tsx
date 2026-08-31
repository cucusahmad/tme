import ChangePasswordForm from "@/components/auth/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Ubah Password</h1>
        <p className="mt-2 text-slate-500">Perbarui password secara berkala untuk menjaga keamanan akun Anda.</p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
