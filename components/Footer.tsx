import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

export async function Footer() {
  const site = await getSiteSettings();

  return (
    <footer className="mt-8 border-t-[3px] border-red-700 bg-slate-950 text-slate-300 sm:mt-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-white">
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-700 text-xl font-black">न</span>
            <span className="text-lg font-black sm:text-xl">{site.site_name}</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">{site.tagline}</p>
          <p className="mt-2 text-xs font-semibold text-slate-500">अजमेर • राजस्थान</p>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-white">उपयोगी लिंक</h2>
          <nav aria-label="फुटर नेविगेशन" className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm md:flex-col md:items-start">
            <Link href="/" className="transition hover:text-white">होम</Link>
            <Link href="/search" className="transition hover:text-white">खबर खोजें</Link>
            <Link href="/admin/login" className="transition hover:text-white">एडमिन लॉगिन</Link>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-white">संपर्क</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            {site.contact_phone && (
              <a href={"tel:" + site.contact_phone.replace(/[^\d+]/g, "")} className="flex items-start gap-2.5 break-all transition hover:text-white">
                <Phone size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {site.contact_phone}
              </a>
            )}
            {site.contact_email && (
              <a href={"mailto:" + site.contact_email} className="flex items-start gap-2.5 break-all transition hover:text-white">
                <Mail size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {site.contact_email}
              </a>
            )}
            {!site.contact_phone && !site.contact_email && (
              <p>स्थानीय समाचार और जनहित की खबरें</p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs leading-6 text-slate-500">
        © {new Date().getFullYear()} {site.site_name}. सर्वाधिकार सुरक्षित।
      </div>
    </footer>
  );
}
