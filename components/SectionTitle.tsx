export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 sm:mb-5 sm:gap-3">
      <span className="h-5 w-1 rounded bg-red-700 sm:h-7 sm:w-1.5" />
      <h2 className="text-[17px] font-black sm:text-2xl">{children}</h2>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
