import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import AnimatedBackground from "@/components/common/AnimatedBackground";
import { PropsWithChildren } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = ({ children }: PropsWithChildren) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      {isMobile ? (
        <>
          <MobileHeader />
          <main className="relative z-10 min-h-screen pt-16">
            {children}
          </main>
        </>
      ) : (
        <>
          <Sidebar />
          <main className="ml-64 relative z-10 min-h-screen">
            {children}
          </main>
        </>
      )}
    </div>
  );
};

export default AppLayout;
