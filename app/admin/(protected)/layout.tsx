import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="min-h-screen bg-slate-100 lg:flex"><AdminSidebar/><main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main></div>;
}
