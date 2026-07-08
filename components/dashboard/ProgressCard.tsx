import DashboardCard from "./DashboardCard";

export default function ProgressCard() {
  const progress = 45;

  return (
    <DashboardCard>

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold text-white">
          Registration Progress
        </h2>

        <span className="text-cyan-400 font-bold">
          {progress}%
        </span>

      </div>

      <div className="mt-6 h-4 rounded-full bg-slate-800">

        <div
          style={{
            width: `${progress}%`,
          }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
        />

      </div>

      <p className="mt-5 text-slate-400">
        Complete your profile to continue registration.
      </p>

    </DashboardCard>
  );
}