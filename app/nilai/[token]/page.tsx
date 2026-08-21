import PublicAssessment from "@/components/public-assessment/PublicAssessment";

export default async function PublicAssessmentPage({ params }: PageProps<"/nilai/[token]">) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10 sm:py-16">
      <div className="mx-auto mb-8 max-w-4xl text-center">
        <p className="text-lg font-bold tracking-tight text-blue-700">Talent Match</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Penilaian eksternal</p>
      </div>
      <PublicAssessment token={token} />
    </main>
  );
}
