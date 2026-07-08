import BiodataForm from "@/components/dashboard/profile//BiodataForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Biodata
        </h1>

        <p className="mt-2 text-slate-500">
          Lengkapi biodata Anda sebelum mengerjakan assessment.
        </p>

      </div>

      <BiodataForm />

    </div>
  );
}