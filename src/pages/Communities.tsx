import AppLayout from "@/components/layout/AppLayout";
import Seo from "@/components/common/Seo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Msg = { id: string; from: string; text: string };

const MicroCommunities = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", from: "NovaBytes", text: "Welcome to the creator support room!" },
    { id: "2", from: "RedLens", text: "Sharing a color grading LUT later today." },
  ]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const send = () => {
    if (!text.trim()) return;
    setMessages(m => [...m, { id: String(Date.now()), from: "You", text: text.trim() }]);
    setText("");
  };

  return (
    <AppLayout>
      <Seo title="Micro-communities | Ares" description="Chat with creators and writers for support and collaboration." canonical={window.location.href} />
      <div className="flex flex-col h-[calc(100vh-0px)]">
        <header className="ml-64 md:ml-0"></header>
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="relative">
              <Avatar className="h-10 w-10"><AvatarFallback>GC</AvatarFallback></Avatar>
              <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-[hsl(var(--brand))]" />
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">Creator Support Group <Users className="h-4 w-4" /></div>
              <div className="text-xs text-muted-foreground">128 members • 12 active</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`max-w-[75%] p-3 rounded-lg ${m.from === 'You' ? 'ml-auto bg-[hsl(var(--brand)/0.2)]' : 'bg-card/80'}`}>
                <div className="text-xs text-muted-foreground mb-1">{m.from}</div>
                <div>{m.text}</div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="pb-6">
            <div className="flex items-center gap-2">
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
              <Button onClick={send}>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MicroCommunities;
