import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen gap-4 overflow-x-hidden bg-[#f4f6f5] p-3 text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Topbar />
        <main className="flex-1 overflow-y-auto pb-1 pr-1">
          {children}
        </main>
      </div>
    </div>
  );
}
