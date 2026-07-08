import DashboardCard from "./DashboardCard";

const activities = [
  "Account created",
  "Competition selected",
  "Profile updated",
];

export default function ActivityCard() {
  return (
    <DashboardCard>

      <h2 className="text-xl font-bold text-white">
        Recent Activity
      </h2>

      <div className="mt-6 space-y-4">

        {activities.map((activity) => (

          <div
            key={activity}
            className="flex items-center gap-3"
          >
            <div className="h-3 w-3 rounded-full bg-cyan-400" />

            <p className="text-slate-300">
              {activity}
            </p>

          </div>

        ))}

      </div>

    </DashboardCard>
  );
}