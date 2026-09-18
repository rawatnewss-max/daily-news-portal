export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-7 w-1.5 rounded bg-red-700" />
      <h2 className="text-xl font-black sm:text-2xl">{children}</h2>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
