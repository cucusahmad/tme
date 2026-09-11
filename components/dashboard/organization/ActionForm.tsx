"use client";

import { useActionState, type ReactNode } from "react";
import type { MembershipActionState } from "@/app/dashboard/organization/actions";

export default function ActionForm({ action, children, className = "space-y-3" }: {
  action: (state: MembershipActionState, form: FormData) => Promise<MembershipActionState>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { success: false, message: "" });
  return <form action={formAction} className={className}>
    <fieldset disabled={pending} className="space-y-3 disabled:opacity-60">{children}</fieldset>
    <p role="status" className={`text-sm ${state.success ? "text-emerald-700" : "text-red-700"}`}>
      {pending ? "Memproses..." : state.message}
    </p>
  </form>;
}
