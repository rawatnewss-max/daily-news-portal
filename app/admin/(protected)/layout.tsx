import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="min-h-screen bg-[#f5f7fb] lg:flex"><AdminSidebar/><main className="min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9"><div className="mx-auto w-full max-w-6xl">{children}</div></main></div>;
}
