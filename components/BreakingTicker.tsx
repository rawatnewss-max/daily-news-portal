import { createClient } from "@/lib/supabase/server";

export async function BreakingTicker() {
  const supabase = await createClient();

  const { data: breaking } = await supabase
    .from("breaking_ticker")
    .select("id,text,is_active,sort_order,created_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(20);

  if (!breaking || breaking.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-2 sm:px-6 lg:px-8">

        <span className="breaking-flash shrink-0 rounded bg-white px-2 py-1 text-xs font-black text-red-700">
          BREAKING
        </span>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="breaking-ticker flex w-max gap-8 whitespace-nowrap text-sm font-semibold">
            {breaking.map((item) => (
              <span key={item.id}>
                {item.text}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
