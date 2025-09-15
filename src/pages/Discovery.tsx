import AppLayout from "@/components/layout/AppLayout";
import Seo from "@/components/common/Seo";
import { useEffect, useMemo, useState } from "react";
import PitchCard, { Pitch } from "@/components/discovery/PitchCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, MessageSquareMore, Heart, Search, User, Star } from "lucide-react";
import samplePhoto from "@/assets/sample-photo-1.jpg";


export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  engagementRate: number;
  interests: string[];
  location?: string;
  joinedDate: string;
}

const initialPitches: Pitch[] = [
  {
    id: "1",
    name: "NovaBytes",
    bio: "Short tech explainers with daily app tips.",
    sample: "Why your browser eats RAM & 3 fixes you can try today.",
    tags: ["Tech", "Productivity"],
    video: "/media/sample-video.mp4",
    poster: samplePhoto,
    followerCount: 45200,
    viewCount: 1200000,
  },
  {
    id: "2",
    name: "RedLens",
    bio: "Street photography breakdowns and editing workflows.",
    sample: "Shooting at night with only neon light—ISO tradeoffs.",
    tags: ["Photography"],
    photo: samplePhoto,
    followerCount: 18500,
    viewCount: 680000,
  },
  {
    id: "3",
    name: "KitchenLab",
    bio: "5-min science cooking for busy weekdays.",
    sample: "Browning vs. burning: butter temp guide in 60s.",
    tags: ["Cooking", "Science"],
    audio: "/media/sample-audio.mp3",
    followerCount: 32100,
    viewCount: 950000,
  },
  {
    id: "4",
    name: "CodeWhisper",
    bio: "JavaScript tips and tricks for modern developers.",
    sample: "Array methods that will change how you code.",
    tags: ["Programming", "JavaScript"],
    photo: samplePhoto,
    followerCount: 67800,
    viewCount: 1800000,
  },
  {
    id: "5",
    name: "NatureSounds",
    bio: "Ambient nature recordings for focus and relaxation.",
    sample: "Forest rain with distant thunder - 10 hour loop.",
    tags: ["Nature", "Relaxation"],
    audio: "/media/sample-audio.mp3",
    followerCount: 28300,
    viewCount: 750000,
  },
];

const initialUsers: UserProfile[] = [
  {
    id: "u1",
    name: "Alex Chen",
    bio: "Tech enthusiast and startup founder based in SF",
    avatar: samplePhoto,
    engagementRate: 8542,
    interests: ["Tech", "Startups", "AI"],
    location: "San Francisco, CA",
    joinedDate: "2023-01-15",
  },
  {
    id: "u2",
    name: "Maya Rodriguez",
    bio: "Food blogger and recipe developer",
    avatar: samplePhoto,
    engagementRate: 12750,
    interests: ["Cooking", "Food", "Travel"],
    location: "Barcelona, Spain",
    joinedDate: "2022-08-20",
  },
  {
    id: "u3",
    name: "Sam Johnson",
    bio: "Photography student and street art lover",
    avatar: samplePhoto,
    engagementRate: 3420,
    interests: ["Photography", "Art", "Music"],
    location: "Brooklyn, NY",
    joinedDate: "2024-03-10",
  },
];

const Discovery = () => {
  const [pitches, setPitches] = useState<Pitch[]>(initialPitches);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("creators");
  

  const filteredPitches = useMemo(() => {
    const q = query.toLowerCase().trim();
    return pitches.filter(p => {
      const matchQuery = !q || [p.name, p.bio, p.sample, ...(p.tags || [])].join(" ").toLowerCase().includes(q);
      return matchQuery;
    });
  }, [pitches, query]);

  const filteredUsers = useMemo(() => {
    const q = query.toLowerCase().trim();
    return users.filter(u => {
      const matchQuery = !q || [u.name, u.bio, ...(u.interests || [])].join(" ").toLowerCase().includes(q);
      return matchQuery;
    });
  }, [users, query]);

  // Get recommended pitches based on user search history
  const searchHistory = JSON.parse(localStorage.getItem("ares_search_history") || "[]");
  const recommendedPitches = useMemo(() => {
    if (searchHistory.length === 0) return filteredPitches.slice(0, 3);
    return filteredPitches.filter(p => 
      p.tags?.some(tag => searchHistory.some((hist: string) => hist.toLowerCase().includes(tag.toLowerCase())))
    ).slice(0, 3);
  }, [filteredPitches, searchHistory]);

  // Get explore pitches (newer/less popular ones)
  const explorePitches = useMemo(() => {
    return filteredPitches.filter(p => !recommendedPitches.some(rec => rec.id === p.id));
  }, [filteredPitches, recommendedPitches]);

  const currentPitch = activeTab === "recommended" ? recommendedPitches[0] : 
                     activeTab === "explore" ? explorePitches[0] : null;
  const currentUser = activeTab === "people" ? filteredUsers[0] : null;

  useEffect(() => {
    try {
      const saved: Pitch[] = JSON.parse(localStorage.getItem("ares_pitches") || "[]");
      if (Array.isArray(saved) && saved.length) {
        const byId = new Map<string, Pitch>();
        [...saved, ...initialPitches].forEach(p => byId.set(p.id, p));
        setPitches(Array.from(byId.values()));
      }
    } catch {}
  }, []);

  const like = () => {
    if (!currentPitch && !currentUser) return;
    
    if (currentPitch) {
      const subs = new Set(JSON.parse(localStorage.getItem("ares_subs") || "[]"));
      subs.add(currentPitch.name);
      localStorage.setItem("ares_subs", JSON.stringify(Array.from(subs)));

      const likes = Number(localStorage.getItem("ares_likes") || 0) + 1;
      localStorage.setItem("ares_likes", String(likes));

      setPitches((arr) => arr.filter(p => p.id !== currentPitch.id));
      toast({ 
        title: `Subscribed to ${currentPitch.name}`, 
        description: "Email Subscribed" 
      });
    } else if (currentUser) {
      const connections = new Set(JSON.parse(localStorage.getItem("ares_connections") || "[]"));
      connections.add(currentUser.name);
      localStorage.setItem("ares_connections", JSON.stringify(Array.from(connections)));

      setUsers((arr) => arr.filter(u => u.id !== currentUser.id));
      toast({ title: `Connected with ${currentUser.name}` });
    }
  };

  const dislike = () => {
    if (currentPitch) {
      setPitches((arr) => arr.filter(p => p.id !== currentPitch.id));
    } else if (currentUser) {
      setUsers((arr) => arr.filter(u => u.id !== currentUser.id));
    }
  };

  const flag = () => {
    toast({ title: "Flag submitted", description: "Thanks for helping keep Ares healthy." });
  };

  const submitSuggestion = () => {
    const target = currentPitch || currentUser;
    if (!target || !suggestion.trim()) return;
    const key = "ares_suggestions";
    const list: Array<{ to: string; text: string }> = JSON.parse(localStorage.getItem(key) || "[]");
    list.push({ to: target.name, text: suggestion.trim() });
    localStorage.setItem(key, JSON.stringify(list));
    setSuggestion("");
    setSuggestionOpen(false);
    toast({ title: "Suggestion sent" });
  };

  // Save search to history
  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const history = JSON.parse(localStorage.getItem("ares_search_history") || "[]");
      if (!history.includes(value.trim())) {
        history.push(value.trim());
        localStorage.setItem("ares_search_history", JSON.stringify(history.slice(-10))); // Keep last 10 searches
      }
    }
  };


  return (
    <AppLayout>
      <Seo
        title="Discovery | Ares"
        description="Search niches and swipe through creator pitch cards. Like to auto-subscribe, suggest improvements, or flag content."
        canonical={window.location.href}
      />

      <div className="min-h-screen flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search niches, creators, topics..."
              aria-label="Search"
              className="pl-9"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur border border-white/10">
            <TabsTrigger value="recommended" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white hover:bg-white/5 transition-all">Recommended</TabsTrigger>
            <TabsTrigger value="explore" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white hover:bg-white/5 transition-all">Explore</TabsTrigger>
            <TabsTrigger value="people" className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white hover:bg-white/5 transition-all">People</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-google-display font-semibold mb-2 text-white">Recommended For You</h3>
              <p className="text-sm text-white/70 font-google-body">Curated content based on your interests and search history</p>
            </div>
            {recommendedPitches[0] ? (
              <div className="space-y-4 w-full">
                <PitchCard pitch={recommendedPitches[0]} onSwipe={(dir) => (dir === 'right' ? like() : dislike())} onFlag={flag} />
                <div className="flex items-center justify-center gap-3">
                  <Button 
                    variant="outline" 
                    className="px-6 bg-muted/20 border-muted text-muted-foreground hover:bg-muted/40 font-google-body transition-all duration-300 hover:scale-105" 
                    onClick={dislike} 
                    aria-label="Not interested"
                  >
                    <X className="h-4 w-4 mr-2" />Not interested
                  </Button>
                  <Dialog open={suggestionOpen} onOpenChange={setSuggestionOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <MessageSquareMore className="h-4 w-4 mr-2" />Suggest
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Suggestion for {recommendedPitches[0]?.name}</DialogTitle>
                      </DialogHeader>
                      <Textarea value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="Share constructive feedback" />
                      <div className="flex justify-end">
                        <Button onClick={submitSuggestion}>Send</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={like} aria-label="Like and subscribe">
                    <Heart className="h-4 w-4 mr-2" />Like
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-semibold">No recommendations yet</h3>
                <p className="text-muted-foreground">Start searching to get personalized recommendations</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="explore" className="mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-google-display font-semibold mb-2 text-white">Explore New Niches</h3>
              <p className="text-sm text-white/70 font-google-body">Discover emerging creators and unexplored content areas</p>
            </div>
            {explorePitches[0] ? (
              <div className="space-y-4 w-full">
                <PitchCard pitch={explorePitches[0]} onSwipe={(dir) => (dir === 'right' ? like() : dislike())} onFlag={flag} />
                <div className="flex items-center justify-center gap-3">
                  <Button 
                    variant="outline" 
                    className="px-6 bg-muted/20 border-muted text-muted-foreground hover:bg-muted/40 font-google-body transition-all duration-300 hover:scale-105" 
                    onClick={dislike} 
                    aria-label="Not interested"
                  >
                    <X className="h-4 w-4 mr-2" />Not interested
                  </Button>
                  <Dialog open={suggestionOpen} onOpenChange={setSuggestionOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <MessageSquareMore className="h-4 w-4 mr-2" />Suggest
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Suggestion for {explorePitches[0]?.name}</DialogTitle>
                      </DialogHeader>
                      <Textarea value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="Share constructive feedback" />
                      <div className="flex justify-end">
                        <Button onClick={submitSuggestion}>Send</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={like} aria-label="Like and subscribe">
                    <Heart className="h-4 w-4 mr-2" />Like
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-semibold">No new content</h3>
                <p className="text-muted-foreground">Check back later for fresh discoveries</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="people" className="mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-google-display font-semibold mb-2 text-white">Connect with People</h3>
              <p className="text-sm text-white/70 font-google-body">Discover and connect with interesting people in your areas of interest</p>
            </div>
            {currentUser ? (
              <div className="space-y-4 w-full">
                <div className="bg-card border rounded-xl p-6 text-center shadow-lg max-w-md mx-auto">
                  <div className="mb-4">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="text-xl font-bold mb-1">{currentUser.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{currentUser.bio}</p>
                    {currentUser.location && (
                      <p className="text-xs text-muted-foreground mb-2">{currentUser.location}</p>
                    )}
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{currentUser.engagementRate.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">engagement score</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {currentUser.interests.map((interest) => (
                      <span key={interest} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(currentUser.joinedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Button 
                    variant="outline" 
                    className="px-6 bg-muted/20 border-muted text-muted-foreground hover:bg-muted/40 font-google-body transition-all duration-300 hover:scale-105" 
                    onClick={dislike} 
                    aria-label="Not interested"
                  >
                    <X className="h-4 w-4 mr-2" />Pass
                  </Button>
                  <Dialog open={suggestionOpen} onOpenChange={setSuggestionOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <MessageSquareMore className="h-4 w-4 mr-2" />Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Message {currentUser.name}</DialogTitle>
                      </DialogHeader>
                      <Textarea value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="Send a friendly message..." />
                      <div className="flex justify-end">
                        <Button onClick={submitSuggestion}>Send</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={like} aria-label="Connect">
                    <User className="h-4 w-4 mr-2" />Connect
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-semibold">No people found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Discovery;
