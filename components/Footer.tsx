import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

export async function Footer() {
  const site = await getSiteSettings();
  return (
    <footer className="mt-12 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="text-xl font-black text-white">{site.site_name}</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">{site.tagline}</p>
        </div>
        <div>
          <div className="font-bold text-white">त्वरित लिंक</div>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/">होम</Link>
            <Link href="/search">खोजें</Link>
            <Link href="/admin/login">Admin Login</Link>
          </div>
        </div>
        <div>
          <div className="font-bold text-white">संपर्क</div>
          <div className="mt-3 space-y-1 text-sm text-slate-400">
            {site.contact_phone && <div>फोन: {site.contact_phone}</div>}
            {site.contact_email && <div>ईमेल: {site.contact_email}</div>}
            {!site.contact_phone && !site.contact_email && <div>Admin Panel से संपर्क विवरण जोड़ें।</div>}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} {site.site_name}. सर्वाधिकार सुरक्षित।</div>
    </footer>
  );
}
