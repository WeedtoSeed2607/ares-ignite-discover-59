import AppLayout from "@/components/layout/AppLayout";
import Seo from "@/components/common/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PitchEditor from "@/components/discovery/PitchEditor";
import UserProfile from "@/components/profile/UserProfile";
import { Button } from "@/components/ui/button";

const genWeek = () => Array.from({ length: 7 }).map((_, i) => ({ day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], views: Math.floor(200 + Math.random()*400), likes: Math.floor(50 + Math.random()*150) }));

const Index = () => {
  const [data] = useState(genWeek());
  const [showAnalytics, setShowAnalytics] = useState(false);

  // track views
  useEffect(() => {
    const v = Number(localStorage.getItem("ares_views") || 0) + 1;
    localStorage.setItem("ares_views", String(v));
  }, []);

  const views = Number(localStorage.getItem("ares_views") || 0);
  const likes = Number(localStorage.getItem("ares_likes") || 0);
  const suggestions: Array<{ to: string; text: string }> = JSON.parse(localStorage.getItem("ares_suggestions") || "[]");

  const topSuggestions = useMemo(() => {
    const freq = new Map<string, number>();
    suggestions.forEach(s => freq.set(s.text, (freq.get(s.text) || 0) + 1));
    return Array.from(freq.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5);
  }, [suggestions.length]);

  return (
    <AppLayout>
      <Seo title="Ares – Creator Discovery & Communities" description="Discover creators, follow your feed, and join micro-communities. Analytics show views, likes, and top suggestions." canonical={window.location.href} jsonLd={{"@context":"https://schema.org","@type":"WebSite","name":"Ares","url":window.location.origin}} />
      <div className="container py-10 space-y-8">
        
        {/* 1. My Profile - First section */}
        <div className="w-full">
          <UserProfile />
        </div>

        {/* 2. Analytics Dashboard - Collapsible second section */}
        <div className="w-full">
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="w-full justify-between text-left font-google-display text-xl p-6 glass-card hover-glow"
          >
            <span className="seductive-header">Analytics Dashboard</span>
            {showAnalytics ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
          
          {showAnalytics && (
            <div className="mt-6 space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card hover-glow">
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground font-google-body">Total views</div>
                    <div className="text-3xl font-google-display font-bold mt-2 text-primary">{views}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card hover-glow">
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground font-google-body">Total likes</div>
                    <div className="text-3xl font-google-display font-bold mt-2 text-primary">{likes}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card hover-glow">
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground font-google-body">Suggestions received</div>
                    <div className="text-3xl font-google-display font-bold mt-2 text-primary">{suggestions.length}</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card hover-glow">
                <CardContent className="p-6">
                  <div className="seductive-header mb-4">Engagement this week</div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" className="font-google-body" />
                        <Tooltip cursor={{ fill: 'hsla(var(--primary),0.1)' }} />
                        <Bar dataKey="views" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
                        <Bar dataKey="likes" fill="hsl(var(--accent))" radius={[6,6,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass-card hover-glow">
                  <CardContent className="p-6">
                    <div className="seductive-header mb-4">Top suggestions</div>
                    <ul className="space-y-2">
                      {topSuggestions.length > 0 ? topSuggestions.map(([text,count]) => (
                        <li key={text} className="flex items-start justify-between gap-4">
                          <span className="text-sm font-google-body">{text}</span>
                          <span className="text-xs text-muted-foreground font-google-body">{count}</span>
                        </li>
                      )) : <li className="text-sm text-muted-foreground font-google-body">No suggestions yet.</li>}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="glass-card hover-glow">
                  <CardContent className="p-6">
                    <div className="seductive-header mb-4">Get started</div>
                    <ol className="list-decimal list-inside space-y-2 text-sm font-google-body">
                      <li>Open Discovery and like creators you enjoy.</li>
                      <li>Leave constructive suggestions to help them improve.</li>
                      <li>Visit your Feed to see new content from subscriptions.</li>
                      <li>Join Micro-communities to collaborate in real time.</li>
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* 3. Pitch Editor - Third section */}
        <div className="w-full">
          <PitchEditor />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
