import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreakingTicker } from "@/components/BreakingTicker";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <BreakingTicker />
      <main>{children}</main>
      <Footer />
      <div aria-hidden="true" className="h-16 sm:hidden" />
      <MobileBottomNav />
    </>
  );
}
