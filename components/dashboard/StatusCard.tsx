"use client";

import { useEffect, useState } from "react";

import DashboardCard from "./DashboardCard";

import api from "@/lib/api";

export default function StatusCard() {
  const [profile, setProfile] = useState<any>(null);

  const [members, setMembers] = useState<any[]>([]);

  const [documents, setDocuments] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileRes, memberRes, documentRes] =
        await Promise.all([
          api.get("/participant/profile"),
          api.get("/participant/member"),
          api.get("/participant/document"),
        ]);

      setProfile(profileRes.data.data);

      setMembers(memberRes.data.data);

      setDocuments(documentRes.data.data);

    } catch (error) {
      console.error(error);
    }
  }

  const profileCompleted =
    profile?.team_name &&
    profile?.leader_name;

  const teamCompleted =
    members.length > 0;

  const paymentUploaded =
    documents.some(
      (doc: any) =>
        doc.document_type ===
        "PAYMENT"
    );

  const progress =
    [
      profileCompleted,
      teamCompleted,
      paymentUploaded,
    ].filter(Boolean).length;

  const percent =
    (progress / 3) * 100;

  return (
    <DashboardCard>

      <h2 className="text-xl font-bold text-white">
        Registration Status
      </h2>

      <div className="mt-6">

        <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-yellow-400">
          {profile?.registration_status ??
            "Draft"}
        </span>

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm">

          <span className="text-slate-400">
            Progress
          </span>

          <span className="text-cyan-400">
            {percent}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
            style={{
              width: `${percent}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-8 space-y-5">

        <div className="flex justify-between">

          <span className="text-slate-400">
            Competition
          </span>

          <span className="font-semibold text-white">
            {profile?.competition
              ?.competition_name ??
              "-"}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            Profile
          </span>

          <span
            className={
              profileCompleted
                ? "text-green-400"
                : "text-yellow-400"
            }
          >
            {profileCompleted
              ? "Completed"
              : "Incomplete"}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            Team Members
          </span>

          <span
            className={
              teamCompleted
                ? "text-green-400"
                : "text-yellow-400"
            }
          >
            {members.length} Member(s)
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-400">
            Payment
          </span>

          <span
            className={
              paymentUploaded
                ? "text-green-400"
                : "text-yellow-400"
            }
          >
            {paymentUploaded
              ? "Uploaded"
              : "Waiting"}
          </span>

        </div>

      </div>

    </DashboardCard>
  );
}