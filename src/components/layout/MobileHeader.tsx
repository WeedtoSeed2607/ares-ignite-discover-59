import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./MobileSidebar";

const MobileHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b border-border z-50 flex items-center justify-between px-4">
      <h1 className="font-sk-cuber text-xl font-bold text-foreground hover-glow">ARES.</h1>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <MobileSidebar onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileHeader;