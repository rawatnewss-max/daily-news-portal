import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreakingTicker } from "@/components/BreakingTicker";
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
<BreakingTicker />
<main>{children}</main>
      <Footer />
    </>
  );
}
