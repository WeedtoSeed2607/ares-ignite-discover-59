import AppLayout from "@/components/layout/AppLayout";
import Seo from "@/components/common/Seo";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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

// New tier data (1-100 connections)
const newTierPitches: Pitch[] = [
  {
    id: "n1",
    name: "TechTips",
    bio: "Quick tech tutorials for beginners.",
    sample: "How to set up your first GitHub repository in 3 minutes.",
    tags: ["Tech", "Beginner"],
    video: "/media/sample-video.mp4",
    poster: samplePhoto,
    followerCount: 67,
    viewCount: 45,
    socialMedia: [
      { platform: 'youtube', url: 'https://youtube.com/@techtips' },
      { platform: 'github', url: 'https://github.com/techtips' },
      { platform: 'twitter', url: 'https://twitter.com/techtips' }
    ]
  },
  {
    id: "n2",
    name: "SnapDaily",
    bio: "Daily photography challenges and tips.",
    sample: "Day 15: Capturing golden hour with your phone camera.",
    tags: ["Photography", "Mobile"],
    photo: samplePhoto,
    followerCount: 89,
    viewCount: 78,
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/snapdaily' },
      { platform: 'tiktok', url: 'https://tiktok.com/@snapdaily' },
      { platform: 'youtube', url: 'https://youtube.com/@snapdaily' }
    ]
  },
  {
    id: "n3",
    name: "FoodieStart",
    bio: "Simple recipes for cooking beginners.",
    sample: "Perfect pasta in 10 minutes - no fancy equipment needed.",
    tags: ["Cooking", "Simple"],
    audio: "/media/sample-audio.mp3",
    followerCount: 45,
    viewCount: 92,
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/foodiestart' },
      { platform: 'tiktok', url: 'https://tiktok.com/@foodiestart' }
    ]
  },
];

const newTierUsers: UserProfile[] = [
  {
    id: "nu1",
    name: "Jordan Kim",
    bio: "Aspiring developer learning React",
    avatar: samplePhoto,
    engagementRate: 34,
    interests: ["Programming", "Web Dev"],
    location: "Austin, TX",
    joinedDate: "2024-02-15",
  },
  {
    id: "nu2",
    name: "Emma Davis",
    bio: "Photography student exploring street art",
    avatar: samplePhoto,
    engagementRate: 67,
    interests: ["Photography", "Art"],
    location: "Portland, OR",
    joinedDate: "2024-01-20",
  },
];

// Rookie tier data (100-1K connections)
const rookieTierPitches: Pitch[] = [
  {
    id: "r1",
    name: "CodeCraft",
    bio: "Intermediate programming tutorials and best practices.",
    sample: "Building scalable APIs with Node.js and TypeScript.",
    tags: ["Programming", "Backend"],
    video: "/media/sample-video.mp4",
    poster: samplePhoto,
    followerCount: 456,
    viewCount: 650,
    socialMedia: [
      { platform: 'youtube', url: 'https://youtube.com/@codecraft' },
      { platform: 'github', url: 'https://github.com/codecraft' },
      { platform: 'twitter', url: 'https://twitter.com/codecraft' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/codecraft' }
    ]
  },
  {
    id: "r2",
    name: "LensLife",
    bio: "Photography techniques for semi-professionals.",
    sample: "Mastering exposure triangle for dramatic portraits.",
    tags: ["Photography", "Advanced"],
    photo: samplePhoto,
    followerCount: 678,
    viewCount: 890,
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/lenslife' },
      { platform: 'youtube', url: 'https://youtube.com/@lenslife' },
      { platform: 'facebook', url: 'https://facebook.com/lenslife' }
    ]
  },
  {
    id: "r3",
    name: "ChefStory",
    bio: "Restaurant-quality cooking techniques at home.",
    sample: "French mother sauces: Building flavor foundations.",
    tags: ["Cooking", "Professional"],
    audio: "/media/sample-audio.mp3",
    followerCount: 723,
    viewCount: 750,
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/chefstory' },
      { platform: 'tiktok', url: 'https://tiktok.com/@chefstory' },
      { platform: 'youtube', url: 'https://youtube.com/@chefstory' }
    ]
  },
];

const rookieTierUsers: UserProfile[] = [
  {
    id: "ru1",
    name: "Marcus Williams",
    bio: "Full-stack developer with 2+ years experience",
    avatar: samplePhoto,
    engagementRate: 234,
    interests: ["Full-stack", "React", "Node.js"],
    location: "Seattle, WA",
    joinedDate: "2023-06-10",
  },
  {
    id: "ru2",
    name: "Sophia Chen",
    bio: "Professional photographer specializing in events",
    avatar: samplePhoto,
    engagementRate: 567,
    interests: ["Photography", "Events", "Business"],
    location: "Los Angeles, CA",
    joinedDate: "2023-03-15",
  },
];

// Sophomore tier data (1K-10K connections)
const sophomoreTierPitches: Pitch[] = [
  {
    id: "s1",
    name: "TechLeader",
    bio: "Advanced software architecture and team leadership.",
    sample: "Scaling microservices: Lessons from 50M+ user systems.",
    tags: ["Architecture", "Leadership"],
    video: "/media/sample-video.mp4",
    poster: samplePhoto,
    followerCount: 3400,
    viewCount: 5600,
    socialMedia: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/techleader' },
      { platform: 'youtube', url: 'https://youtube.com/@techleader' },
      { platform: 'twitter', url: 'https://twitter.com/techleader' },
      { platform: 'github', url: 'https://github.com/techleader' }
    ]
  },
  {
    id: "s2",
    name: "ProShot",
    bio: "Commercial photography and business growth.",
    sample: "Building a six-figure photography business in 18 months.",
    tags: ["Photography", "Business"],
    photo: samplePhoto,
    followerCount: 5600,
    viewCount: 8900,
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/proshot' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/proshot' },
      { platform: 'facebook', url: 'https://facebook.com/proshot' },
      { platform: 'youtube', url: 'https://youtube.com/@proshot' }
    ]
  },
  {
    id: "s3",
    name: "CulinaryMaster",
    bio: "Fine dining techniques and restaurant management.",
    sample: "Michelin-starred plating techniques for ambitious chefs.",
    tags: ["Culinary", "Fine Dining"],
    audio: "/media/sample-audio.mp3",
    followerCount: 2800,
    viewCount: 3200,
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/culinarymaster' },
      { platform: 'youtube', url: 'https://youtube.com/@culinarymaster' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/culinarymaster' }
    ]
  },
];

const sophomoreTierUsers: UserProfile[] = [
  {
    id: "su1",
    name: "David Rodriguez",
    bio: "Senior software engineer and tech lead at Fortune 500",
    avatar: samplePhoto,
    engagementRate: 2340,
    interests: ["System Design", "Leadership", "Mentoring"],
    location: "New York, NY",
    joinedDate: "2022-01-08",
  },
  {
    id: "su2",
    name: "Isabella Martinez",
    bio: "Award-winning commercial photographer and studio owner",
    avatar: samplePhoto,
    engagementRate: 4560,
    interests: ["Commercial Photography", "Studio Management", "Creative Direction"],
    location: "Miami, FL",
    joinedDate: "2021-11-22",
  },
];

// Launched tier data (10K+ views)
const launchedTierPitches: Pitch[] = [
  {
    id: "l1",
    name: "TechGuru Pro",
    bio: "Enterprise software architecture and industry insights.",
    sample: "Building billion-dollar SaaS platforms: Technical deep dive.",
    tags: ["Enterprise", "Architecture", "SaaS"],
    video: "/media/sample-video.mp4",
    poster: samplePhoto,
    followerCount: 45200,
    viewCount: 125000,
    socialMedia: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/techgurupro' },
      { platform: 'youtube', url: 'https://youtube.com/@techgurupro' },
      { platform: 'twitter', url: 'https://twitter.com/techgurupro' }
    ]
  },
  {
    id: "l2", 
    name: "VisualMaster",
    bio: "Award-winning cinematography and film production.",
    sample: "Hollywood techniques for independent filmmakers.",
    tags: ["Cinematography", "Film", "Production"],
    photo: samplePhoto,
    followerCount: 67800,
    viewCount: 89000,
    socialMedia: [
      { platform: 'youtube', url: 'https://youtube.com/@visualmaster' },
      { platform: 'instagram', url: 'https://instagram.com/visualmaster' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/visualmaster' }
    ]
  },
  {
    id: "l3",
    name: "CulinaryInstitute",
    bio: "Professional culinary training and restaurant consulting.",
    sample: "From kitchen to empire: Restaurant scaling strategies.",
    tags: ["Professional Culinary", "Business", "Consulting"],
    audio: "/media/sample-audio.mp3",
    followerCount: 32100,
    viewCount: 156000,
    socialMedia: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/culinaryinstitute' },
      { platform: 'youtube', url: 'https://youtube.com/@culinaryinstitute' },
      { platform: 'instagram', url: 'https://instagram.com/culinaryinstitute' }
    ]
  }
];

const launchedTierUsers: UserProfile[] = [
  {
    id: "lu1",
    name: "Rachel Thompson",
    bio: "CTO at unicorn startup, former Google senior engineer",
    avatar: samplePhoto,
    engagementRate: 12500,
    interests: ["System Architecture", "Startup Leadership", "AI/ML"],
    location: "San Francisco, CA",
    joinedDate: "2020-03-15",
  },
  {
    id: "lu2",
    name: "Leonardo Rossi",
    bio: "Emmy-winning cinematographer and film school instructor",
    avatar: samplePhoto,
    engagementRate: 18700,
    interests: ["Cinematography", "Film Education", "Visual Storytelling"],
    location: "Los Angeles, CA", 
    joinedDate: "2019-08-10",
  },
];

const getTierData = (tier: string) => {
  switch (tier) {
    case 'new':
      return { pitches: newTierPitches, users: newTierUsers };
    case 'rookie':
      return { pitches: rookieTierPitches, users: rookieTierUsers };
    case 'sophomore':
      return { pitches: sophomoreTierPitches, users: sophomoreTierUsers };
    case 'launched':
      return { pitches: launchedTierPitches, users: launchedTierUsers };
    default:
      return { pitches: newTierPitches, users: newTierUsers };
  }
};

const getTierInfo = (tier: string) => {
  switch (tier) {
    case 'new':
      return { 
        title: "New Discovery", 
        subtitle: "Fresh creators with 1-100 views",
        description: "Discover emerging talent and connect with new voices in your areas of interest"
      };
    case 'rookie':
      return { 
        title: "Rookie Discovery", 
        subtitle: "Growing creators with 100-1K views",
        description: "Connect with established creators who are building their communities"
      };
    case 'sophomore':
      return { 
        title: "Sophomore Discovery", 
        subtitle: "Experienced creators with 1K-10K views",
        description: "Learn from experienced creators with proven track records and strong communities"
      };
    case 'launched':
      return { 
        title: "Launched Discovery", 
        subtitle: "Successful creators with 10K+ views",
        description: "Learn from industry leaders and established creators with massive reach and proven success"
      };
    default:
      return { 
        title: "New Discovery", 
        subtitle: "Fresh creators with 1-100 views",
        description: "Discover emerging talent and connect with new voices in your areas of interest"
      };
  }
};

const DiscoveryTier = () => {
  const location = useLocation();
  const tier = location.pathname.split('/')[2] || 'new'; // Extract tier from URL path

  const { pitches: initialPitches, users: initialUsers } = getTierData(tier);
  const tierInfo = getTierInfo(tier);
  
  const [pitches, setPitches] = useState<Pitch[]>(initialPitches);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recommended");

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
    // Reset data when tier changes
    const { pitches: newPitches, users: newUsers } = getTierData(tier);
    setPitches(newPitches);
    setUsers(newUsers);
  }, [tier]);

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
        title={`${tierInfo.title} | Ares`}
        description={tierInfo.description}
        canonical={window.location.href}
      />

      <div className="min-h-screen flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl mb-6 space-y-3">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-google-display font-bold text-white mb-2">{tierInfo.title}</h1>
            <p className="text-white/80 font-google-body">{tierInfo.subtitle}</p>
            <p className="text-sm text-white/60 mt-2">{tierInfo.description}</p>
          </div>
          
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
                      <span className="text-xs text-muted-foreground">connections</span>
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
                <p className="text-muted-foreground">Try adjusting your search or check back later</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DiscoveryTier;