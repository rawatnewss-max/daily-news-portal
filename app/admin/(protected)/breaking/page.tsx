import { createClient } from "@/lib/supabase/server";
import {
  createBreakingTickerAction,
  deleteBreakingTickerAction,
  toggleBreakingTickerAction,
} from "@/app/admin/actions";

export default async function BreakingTickerPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("breaking_ticker")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Breaking Ticker</h1>
        <p className="mt-1 text-sm text-slate-500">
          वेबसाइट की BREAKING पट्टी में चलने वाली खबर यहाँ लिखें।
        </p>
      </div>

      <form
        action={createBreakingTickerAction}
        className="rounded-xl border bg-white p-5"
      >
        <label className="mb-2 block font-semibold">
          Breaking News Line
        </label>

        <input
          name="text"
          required
          maxLength={250}
          placeholder="ब्रेकिंग खबर की छोटी लाइन लिखें..."
          className="input"
        />

        <label className="mb-2 mt-4 block font-semibold">
          क्रम
        </label>

        <input
          name="sort_order"
          type="number"
          defaultValue="0"
          className="input"
        />

        <button type="submit" className="btn-primary mt-4">
          Breaking Line जोड़ें
        </button>
      </form>

      <div className="space-y-3">
        {items?.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"
          >
            <div>
              <div className="font-semibold">{item.text}</div>

              <div className="mt-1 text-xs text-slate-500">
                {item.is_active ? "Active" : "Inactive"}
              </div>
            </div>

            <div className="flex gap-2">
              <form action={toggleBreakingTickerAction}>
                <input type="hidden" name="id" value={item.id} />
                <input
                  type="hidden"
                  name="is_active"
                  value={item.is_active ? "false" : "true"}
                />

                <button type="submit" className="btn-secondary">
                  {item.is_active ? "Hide" : "Show"}
                </button>
              </form>

              <form action={deleteBreakingTickerAction}>
                <input type="hidden" name="id" value={item.id} />

                <button
                  type="submit"
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
