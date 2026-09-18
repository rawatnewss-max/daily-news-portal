import Link from "next/link";
export default function NotFound() {
  return <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6"><div className="card max-w-lg p-10 text-center"><div className="text-5xl font-black text-red-700">404</div><h1 className="mt-3 text-2xl font-black">पेज नहीं मिला</h1><p className="mt-2 text-slate-600">यह खबर हटाई गई हो सकती है या लिंक गलत है।</p><Link href="/" className="btn-primary mt-5">होम पर जाएँ</Link></div></div>;
}
