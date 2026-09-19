import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const visited = request.cookies.get("dnm_visitor")?.value;

  if (!visited) {
    const { data, error } = await supabase.rpc(
      "increment_total_visitors"
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      total: Number(data ?? 0),
    });

    response.cookies.set("dnm_visitor", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  }

  const { data, error } = await supabase
    .from("site_stats")
    .select("total_visitors")
    .eq("id", 1)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    total: Number(data?.total_visitors ?? 0),
  });
}
